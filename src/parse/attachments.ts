import { Attachment } from 'mailparser';

const PDF_SUFFIX = '.pdf';

export function isPdfFile(pdf: Attachment): boolean {
  return pdf.filename!.endsWith(PDF_SUFFIX);
}
