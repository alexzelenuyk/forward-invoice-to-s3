import * as AWS from "aws-sdk"
import { environment } from "common/environment";
import { Attachment } from "mailparser";
import { getS3KeyPrefix } from "persist/s3KeyPrefix";

export const PDF_SUFFIX = '.pdf'

export async function storePdf(pdf: Attachment): Promise<void> {
    await new AWS.S3({apiVersion: '2006-03-01', region: environment().awsRegion}).putObject({
        Bucket: environment().destinationBucket,
        Key: getS3KeyPrefix().concat('/', pdf.filename!)
    });
}
export function isPdfFile(pdf: Attachment): boolean {
    return pdf.filename!.endsWith(PDF_SUFFIX);
}
