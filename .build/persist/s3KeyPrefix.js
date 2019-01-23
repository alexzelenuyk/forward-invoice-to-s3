"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getS3KeyPrefix() {
    const date = new Date(Date.now());
    return `${date.getFullYear()}/${date.getMonth() + 1}`;
}
exports.getS3KeyPrefix = getS3KeyPrefix;
