"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailparser_1 = require("mailparser");
const body_1 = require("persist/body");
const attachments_1 = require("./parse/attachments");
const mail_1 = require("./parse/mail");
const pdf_1 = require("./persist/pdf");
function findPdf(mail) {
    if (mail.attachments) {
        return mail.attachments.filter(attachments_1.isPdfFile);
    }
    return [];
}
exports.handler = (event, _, callback) => __awaiter(this, void 0, void 0, function* () {
    const messageId = event.Records[0].ses.mail.messageId;
    try {
        const mailBlob = yield mail_1.getMailBlob(messageId);
        const mail = yield mailparser_1.simpleParser(mailBlob.Body.toString('utf-8'));
        yield Promise.all([
            ...findPdf(mail).map(pdf => pdf_1.storePdf(messageId, pdf)),
            body_1.storeBody(messageId, mail.text)
        ]);
    }
    catch (error) {
        const disposition = 'STOP_RULE_SET';
        callback(error, { disposition });
    }
    callback(null, null);
});
