"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PDF_SUFFIX = '.pdf';
function isPdfFile(pdf) {
    return pdf.filename.endsWith(PDF_SUFFIX);
}
exports.isPdfFile = isPdfFile;
