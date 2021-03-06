AWS_REGION ?= eu-west-1

STACK_NAME ?= from-ses-to-s3

SAM_TEMP_BUCKET_NAME ?= sam-deploy-packages
SAM_DIST_DIR = .aws-sam
SAM_DIST_TEMPLATE = $(SAM_DIST_DIR)/sam-template.yaml
SAM_SRC_DIR = ./sam
SAM_SRC_TEMPLATE = $(SAM_SRC_DIR)/template.yaml
SAM_PUBLISH_OUTPUT = ${SAM_DIST_DIR}/publish.yaml

# SAM

create-sam-bucket:
	aws s3api create-bucket \
	--bucket $(SAM_TEMP_BUCKET_NAME) \
	--acl private \
	--create-bucket-configuration LocationConstraint=$(AWS_REGION)

sam-bucket: create-sam-bucket
	aws s3api put-bucket-lifecycle --bucket $(SAM_TEMP_BUCKET_NAME) --lifecycle-configuration '{"Rules":[{"Status":"Enabled","Prefix":"","Expiration":{"Days":1}}]}'

ensure-sam-dir:
	mkdir -p $(SAM_DIST_DIR)

build:
	yarn build

package: ensure-sam-dir
	sam package --s3-bucket $(SAM_TEMP_BUCKET_NAME) --output-template-file $(SAM_DIST_TEMPLATE) --template-file $(SAM_SRC_TEMPLATE)

deploy: ensuresetted-STORAGE_BUCKET_NAME ensuresetted-RECIPIENT_EMAIL package
	sam deploy \
	--template-file $(SAM_DIST_TEMPLATE) \
	--stack-name $(STACK_NAME) \
	--parameter-overrides StorageBucket=${STORAGE_BUCKET_NAME} \
	--parameter-overrides RecipientEmail=${RECIPIENT_EMAIL} \
	--capabilities CAPABILITY_IAM

# AWS setup

activate-ruleset:
	aws ses set-active-receipt-rule-set --rule-set-name \
	`aws cloudformation describe-stacks --stack-name ${STACK_NAME} |\
	jq --raw-output '.Stacks[0].Outputs[] | select(.OutputKey | contains("RulesetsName")) | .OutputValue'`

verify-domain: ensuresetted-DOMAIN ensuresetted-AWS_REGION
	aws ses verify-domain-identity --domain ${DOMAIN} | jq --raw-output '.VerificationToken'

# Debug and development
upload-mail-with-screenshot:
	aws s3api put-object --bucket sam-deploy-packages --key test_mail --body test/integration/sample-mail-with-html

upload-mail-with-pdf:
	aws s3api put-object --bucket sam-deploy-packages --key test_mail --body test/integration/sample-mail-with-pdf

local-invoke-with-pdf: build upload-mail-with-pdf
	sam local invoke -t ./sam/template.yaml -e test/integration/lambda_event_payload.json -n test/integration/env.json

local-invoke-with-screenshot: build upload-mail-with-screenshot
	sam local invoke -t ./sam/template.yaml -e test/integration/lambda_event_payload.json -n test/integration/env.json

lambda-logs:
	sam logs -n \
	`aws cloudformation describe-stacks --stack-name ${STACK_NAME} |\
	jq --raw-output '.Stacks[0].Outputs[] | select(.OutputKey | contains("LambdaFunction")) | .OutputValue | split(":")[6]'`

# Development

install:
	yarn

integration-test:
	! make local-invoke-with-screenshot | grep "errorMessage"
	! make local-invoke-with-pdf | grep "errorMessage"

unit-test:
	yarn test

code-lint:
	yarn lint

cfn-lint:
	yarn lint:cfn

lint-all: code-lint cfn-lint

package-for-upload: ensuresetted-SAM_PUBLISH_BUCKET
	sam package --template-file ./sam/template.yaml --s3-bucket ${SAM_PUBLISH_BUCKET} --region ${AWS_REGION}  --output-template-file ${SAM_PUBLISH_OUTPUT}

publish: package-for-upload
	#sam publish -t ${SAM_PUBLISH_OUTPUT} --region ${AWS_REGION}
	echo "Disabled due to https://github.com/awslabs/aws-sam-cli/issues/955, unsupported resources AWS::SES::ReceiptRule and AWS::SES::ReceiptRuleSet"

# Helper

ensuresetted-%:
	@ if [ "${${*}}" = "" ]; then \
	    echo "Environment variable $* not set"; \
	    exit 1; \
	fi

.PHONY: publish lambda-logs deploy package activate-ruleset build sam-bucket verify-domain local-invoke-with-pdf local-invoke-with-screenshot integration-test unit-test