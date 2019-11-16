import * as S3 from 'aws-sdk/clients/s3';

import { env } from 'common/env';

export async function getMailBlob(messageId: string) {
  const object = {
    Bucket: env().tempMailBucket,
    Key: messageId
  };

  return new S3().getObject(object).promise();
}
