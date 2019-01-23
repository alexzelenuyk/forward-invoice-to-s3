AWS_REGION ?= eu-west-1

STACK_NAME ?= from-ses-to-s3

SAM_TEMP_BUCKET_NAME ?= sam-deploy-packages
SAM_DIST_DIR = .aws-sam
SAM_DIST_TEMPLATE = $(SAM_DIST_DIR)/sam-template.yaml

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
	yarn --cwd src build

package: ensure-sam-dir
	sam package --s3-bucket sam-deploy-packages --output-template-file $(SAM_DIST_TEMPLATE)

deploy: ensuresetted-STORAGE_BUCKET_NAME package
	sam deploy \
	--template-file $(SAM_DIST_TEMPLATE) \
	--stack-name $(STACK_NAME) \
	--parameter-overrides StorageBucket=${STORAGE_BUCKET_NAME} \
	--capabilities CAPABILITY_IAM

activate-ruleset:
	aws ses set-active-receipt-rule-set --rule-set-name \
	`aws cloudformation describe-stacks --stack-name ${STACK_NAME} |\
	jq --raw-output '.Stacks[0].Outputs[] | select(.OutputKey | contains("RulesetsName")) | .OutputValue'`

verify-domain: ensuresetted-DOMAIN ensuresetted-AWS_REGION
	aws ses verify-domain-identity --domain ${DOMAIN} | jq --raw-output '.VerificationToken'

local-invoke:
	sam local invoke -e test/sample/test_email.json -n test/sample/env.json

lambda-logs:
	sam logs -n \
	`aws cloudformation describe-stacks --stack-name ${STACK_NAME} |\
	jq --raw-output '.Stacks[0].Outputs[] | select(.OutputKey | contains("LambdaFunction")) | .OutputValue | split(":")[6]'`

ensuresetted-%:
	@ if [ "${${*}}" = "" ]; then \
	    echo "Environment variable $* not set"; \
	    exit 1; \
	fi

.PHONY: lambda-logs deploy package activate-ruleset build sam-bucket verify-domain