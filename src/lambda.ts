import * as AWS from "aws-sdk"
import { simpleParser } from "mailparser"

import { SESEvent } from "common/event";
import { Callback, Context } from "aws-lambda";
import { env } from "common/env";
import { isPdfFile, storePdf } from "parse/attachments";

export const handler = async (event: SESEvent, context: Context, callback: Callback): Promise<any> => {
    const messageId = event.Records[0].ses.mail.messageId

    try {
        const object = {
            Bucket: env().tempMailBucket,
            Key: messageId
        }
        const mailBlob = await new AWS.S3().getObject(object).promise()
        const mail = await simpleParser(mailBlob.Body.toString('utf-8'))

        if (mail.attachments) {
            await Promise.all(mail.attachments.filter(isPdfFile).map(storePdf))
        }
    } catch (error) {
        const disposition = 'STOP_RULE_SET'
        callback(error, { disposition })
    }

    callback(null, null)
}
