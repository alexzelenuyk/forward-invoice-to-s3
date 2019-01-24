import { Callback, Context } from 'aws-lambda';

import { Attachment, ParsedMail, simpleParser } from 'mailparser';
import { storeBody } from 'persist/body';
import { SESEvent } from './common/event';
import { isPdfFile } from './parse/attachments';
import { getMailBlob } from './parse/mail';
import { storePdf } from './persist/pdf';

function findPdf(mail: ParsedMail): Attachment[] {
  if (mail.attachments) {
    return mail.attachments.filter(isPdfFile);
  }

  return [];
}

export const handler = async (
  event: SESEvent,
  _: Context,
  callback: Callback
): Promise<any> => {
  const messageId = event.Records[0].ses.mail.messageId;

  try {
    const mailBlob = await getMailBlob(messageId);
    const mail = await simpleParser(mailBlob.Body.toString('utf-8'));

    await Promise.all([
      ...findPdf(mail).map(pdf => storePdf(messageId, pdf)),
      storeBody(messageId, mail.text)
    ]);
  } catch (error) {
    const disposition = 'STOP_RULE_SET';
    callback(error, { disposition });
  }

  callback(null, null);
};
