"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];
function getS3KeyPrefix() {
    const date = new Date(Date.now());
    return `${date.getFullYear()}/${months[date.getMonth()]}`;
}
exports.getS3KeyPrefix = getS3KeyPrefix;
function getS3Key(messageId, filename) {
    return getS3KeyPrefix().concat('/', messageId, '/', filename);
}
exports.getS3Key = getS3Key;
