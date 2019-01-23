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
const env_1 = require("common/env");
const S3 = require("aws-sdk/clients/s3");
function getMailBlob(messageId) {
    return __awaiter(this, void 0, void 0, function* () {
        const object = {
            Bucket: env_1.env().tempMailBucket,
            Key: messageId
        };
        return new S3().getObject(object).promise();
    });
}
exports.getMailBlob = getMailBlob;
