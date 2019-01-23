import * as S3 from 'aws-sdk/clients/s3';
import { env } from 'common/env';
import { Attachment } from 'mailparser';
import { getS3KeyPrefix } from './s3KeyPrefix';

export async function storePdf(pdf: Attachment): Promise<void> {
  const object = {
    Bucket: env().destinationBucket,
    Key: getS3KeyPrefix().concat('/', pdf.filename!)
  };

  await new S3().putObject(object).promise();
}
