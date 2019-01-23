"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function fromEnv(name) {
    const variable = process.env[name];
    if (!variable) {
        throw new Error(`${name} is not set`);
    }
    return variable;
}
function env() {
    return {
        destinationBucket: fromEnv('DESTINATION_BUCKET'),
        tempMailBucket: fromEnv('TEMP_MAIL_BUCKET')
    };
}
exports.env = env;
