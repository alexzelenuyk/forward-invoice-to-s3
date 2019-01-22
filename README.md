SAM with Cloudformation template to intercept emails using SES, extract invoices using Lambda and store them categorised to S3.

## Setup

### Build source
```bash
> make build
```

### Credentials
Set your AWS credentials.
You should have all variable above:
```bash
> env | grep AWS
AWS_ACCESS_KEY=<AWS_KEY>
AWS_ACCESS_KEY_ID=<KEY_ID>
AWS_SECRET_KEY=<SECRET_KEY>
AWS_SECRET_ACCESS_KEY=<ACCESS_KEY>
AWS_REGION=eu-west-1
AWS_DEFAULT_REGION=eu-west-1
```

### Deploy stack
```bash
make deploy
```
