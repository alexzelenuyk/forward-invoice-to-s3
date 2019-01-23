import { env } from 'common/env';

import * as S3 from 'aws-sdk/clients/s3';

export async function getMailBlob(messageId: string) {
  const object = {
    Bucket: env().tempMailBucket,
    Key: messageId
  };

  return new S3().getObject(object).promise();
}
