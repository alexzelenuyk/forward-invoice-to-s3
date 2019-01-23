import * as S3 from "aws-sdk/clients/s3";
import { env } from "common/env";
import { Attachment } from "mailparser";
import { getS3KeyPrefix } from "persist/s3KeyPrefix";

const PDF_SUFFIX = '.pdf'

export async function storePdf(pdf: Attachment): Promise<void> {
    const object = {
        Bucket: env().destinationBucket,
        Key: getS3KeyPrefix().concat('/', pdf.filename!)
    }

    await new S3().putObject(object).promise();
}

export function isPdfFile(pdf: Attachment): boolean {
    return pdf.filename!.endsWith(PDF_SUFFIX)
}
