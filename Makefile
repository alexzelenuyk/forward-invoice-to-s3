AWS_REGION ?= eu-west-1
BUCKET_NAME ?= temporary_bucket
STACK_NAME ?= from-ses-to-s3
STORAGE_BUCKET_NAME ?= invoice-storage

SAM_DIST_DIR = .aws-sam
SAM_DIST_TEMPLATE = $(SAM_DIST_DIR)/sam-template.yaml

bucket:
	aws s3api create-bucket \
	--bucket $(BUCKET_NAME) \
	--acl private \
	--create-bucket-configuration LocationConstraint=$(AWS_REGION)

ensure-sam-dir:
	mkdir -p $(SAM_DIST_DIR)

build:
	yarn --cwd src build

package: ensure-sam-dir
	sam package --s3-bucket sam-deploy-packages --output-template-file $(SAM_DIST_TEMPLATE)

deploy: package
	sam deploy \
	--template-file $(SAM_DIST_TEMPLATE) \
	--stack-name $(STACK_NAME) \
	--parameter-overrides StorageBucketPrefix=${STORAGE_BUCKET_NAME} \
	--capabilities CAPABILITY_IAM

local-invoke:
	sam local invoke -e test/sample/test_email.json -n test/sample/env.json
