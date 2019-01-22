BUCKET_NAME ?= BUCKET_NAME
SAM_DIST_DIR = .aws-sam
SAM_DIST_TEMPLATE = $(SAM_DIST_DIR)/sam-template.yaml

bucket:
	aws s3api create-bucket \
	--bucket $(BUCKET_NAME) \
	--acl private \
	--create-bucket-configuration LocationConstraint=eu-west-1

ensure-sam-dir:
	mkdir -p $(SAM_DIST_DIR)

build:
	yarn --cwd src build

package: ensure-sam-dir
	sam package --s3-bucket sam-deploy-packages --output-template-file $(SAM_DIST_TEMPLATE)

deploy: package
	sam deploy --template-file $(SAM_DIST_TEMPLATE) \
	--stack-name sam-tryout \
	--capabilities CAPABILITY_IAM
