interface Environment {
    tempMailBucket: string;
    destinationBucket: string;
}

function ensureEnvironmentVariable(name: string): string {
    const variable = process.env[name];
    if (!variable) {
        throw new Error(`${name} is not set`);
    }

    return variable;
}

export function environment(): Environment {
    return {
        tempMailBucket: ensureEnvironmentVariable('TEMP_MAIL_BUCKET'),
        destinationBucket: ensureEnvironmentVariable('DESTINATION_BUCKET'),
    }
}