import * as S3 from 'aws-sdk/clients/s3';

import { Attachment } from 'mailparser';
import { env } from './../common/env';
import { getS3Key } from './s3Key';

export async function storePdf(
  messageId: string,
  pdf: Attachment
): Promise<void> {
  const object = {
    Body: pdf.content,
    Bucket: env().destinationBucket,
    Key: getS3Key(messageId, pdf.filename!)
  };

  await new S3().putObject(object).promise();
}
