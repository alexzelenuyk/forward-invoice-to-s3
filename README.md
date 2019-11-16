[![CircleCI](https://circleci.com/gh/alexzelenuyk/forward-invoice-to-s3.svg?style=svg)](https://circleci.com/gh/alexzelenuyk/forward-invoice-to-s3)

SAM with Cloudformation template to intercept emails using SES, extract invoices using Lambda and store them categorised to S3.

## Use case

There was a need of storing documents in durable inexpensive store with automatic categoriasation by date.
For example, you need to store all invoices for the last 10 years.
With current tool that's became easier.

Wheneve you receive email with invoice, you can just forward it `invoice@invoice.example.com` and attached invoice will be store in S3.

Folder structure:

```
2009/Jan/5/i23/Internet.pdf
               Body.txt
           456/Mobile.pdf
             Body.txt
     Feb/6/789/Body.txt
```

## Requirements

- [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
- [YARN](https://yarnpkg.com/lang/en/docs/install/#mac-stable)
- [jq](https://stedolan.github.io/jq/)

## Setup

### Download

Clone or fork the repo.

```bash
> git clone git@github.com:alexzelenuyk/forward-invoices-to-s3.git
```

### Setup SAM S3 bucket

We need to create s3 bucket for SAM to store resourcers.
We also configure Lifecycle policy to remove old files after 1day.

```bash
> SAM_TEMP_BUCKET_NAME=<YOU_UNIQUE_SAM_BUCKET_NAME> make sam-bucket
```

### Build source

We need to transpile \*.ts file to JS artifacts.

```bash
> make install
> make build
```

### Credentials

Set your AWS credentials in env variables.
You should have all variables from below:

```bash
> env | grep AWS
AWS_ACCESS_KEY_ID=<KEY_ID>
AWS_SECRET_ACCESS_KEY=<ACCESS_KEY>
AWS_REGION=<region>
```

Be aware, that AWS SES at the moment is available only in `us-east-1`, `us-west-2` and `eu-west-1`

### Deploy stack

```bash
> STORAGE_BUCKET_NAME=bucket-name make deploy
```

We have following variables:

| Env variable        | Description                                                              | Required | Default        |
| ------------------- | ------------------------------------------------------------------------ | -------- | -------------- |
| STORAGE_BUCKET_NAME | Bucket name where we will store resulted documents, must unique globaluy | true     |                |
| STACK_NAME          | Cloudformation stack name                                                | false    | from-ses-to-s3 |

### Activate SES rulesets

```bash
> make activate-ruleset
```

We will take RulesetsName from Cfn stack output and trigger activation via cli api.

### Validate your domain

#### Start verification

You need to verify domain, which you'll use to send emails.
You can verify you domain, like: `example.com` or create another subddomain for invoices, like: `invoice.example.com`.

AWS needs to verify you domain ownership.

```bash
> DOMAIN=invoice.example.com make verify-domain
```

As an output you'll get verification token, save it.

#### Configure DNS records

You need to add following DNS recors:

| Records type | Host                            | Content                               |
| ------------ | ------------------------------- | ------------------------------------- |
| TXT          | \_amazonses.invoice.example.com | Verification token from previous step |
| MX           | invoice.example.com             | inbound-smtp.eu-west-1.amazonaws.com  |

#### AWS verification

AWS will need to verify you domain ownership, that will take some time.
According to the [doc](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-domain-procedure.html) it can take up to 72 hours.
In reality it's done in a few minutes. You can check the status in AWS Console > SES > Domains

### Enjoy

That should be it. You can test it by sending email to `any-recepient@invoice.example.com`
