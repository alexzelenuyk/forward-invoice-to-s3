import { Callback, Context } from 'aws-lambda';

import { SESEvent } from 'common/event';
import { simpleParser } from 'mailparser';
import { isPdfFile } from 'parse/attachments';
import { getMailBlob } from 'parse/mail';
import { storePdf } from 'persist/pdf';

export const handler = async (
  event: SESEvent,
  context: Context,
  callback: Callback
): Promise<any> => {
  const messageId = event.Records[0].ses.mail.messageId;

  try {
    const mailBlob = await getMailBlob(messageId)
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
