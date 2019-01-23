import * as S3 from 'aws-sdk/clients/s3';

import { Callback, Context } from 'aws-lambda';

import { env } from 'common/env';
import { SESEvent } from 'common/event';
import { simpleParser } from 'mailparser';
import { isPdfFile } from 'parse/attachments';
import { storePdf } from 'persist/pdf';

export const handler = async (
  event: SESEvent,
  context: Context,
  callback: Callback
): Promise<any> => {
  const messageId = event.Records[0].ses.mail.messageId;

  try {
    const object = {
      Bucket: env().tempMailBucket,
      Key: messageId
    };
    const mailBlob = await new S3().getObject(object).promise();
    const mail = await simpleParser(mailBlob.Body.toString('utf-8'));

    if (mail.attachments) {
      await Promise.all(mail.attachments.filter(isPdfFile).map(storePdf));
    }
  } catch (error) {
    const disposition = 'STOP_RULE_SET';
    callback(error, { disposition });
  }

  callback(null, null);
};
