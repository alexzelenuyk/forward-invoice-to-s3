import * as S3 from 'aws-sdk/clients/s3';

import { env } from './../common/env';
import { getS3Key } from './s3Key';

const filename = 'Body.txt';

export async function storeBody(
  messageId: string,
  body: string
): Promise<void> {
  const object = {
    Body: body,
    Bucket: env().destinationBucket,
    Key: getS3Key(messageId, filename)
  };

  await new S3().putObject(object).promise();
}
