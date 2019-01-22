import * as AWS from "aws-sdk"
import { simpleParser } from "mailparser"

import { SESEvent } from "common/event";
import { Callback, Context } from "aws-lambda";
import { environment } from "common/environment";
import { isPdfFile, storePdf } from "parse/attachments";

export const handler = async (event: SESEvent, context: Context, callback: Callback): Promise<any> => {
    const messageId = event.Records[0].ses.mail.messageId

    try {
        const mailBlob = await new AWS.S3().getObject({
            Bucket: environment().tempMailBucket,
            Key: messageId
        })

        const mail = await simpleParser(mailBlob.createReadStream())

        if (mail.attachments) {
            await Promise.all(mail.attachments.filter(isPdfFile).map(storePdf))
        }
    } catch (error) {
        const disposition = 'STOP_RULE_SET'
        callback(error, { disposition });
    }

    callback(null, null);
}
