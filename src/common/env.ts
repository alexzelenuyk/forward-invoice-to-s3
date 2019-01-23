interface Variables {
    tempMailBucket: string;
    destinationBucket: string;
}

function fromEnv(name: string): string {
    const variable = process.env[name];
    if (!variable) {
        throw new Error(`${name} is not set`);
    }

    return variable;
}

export function env(): Variables {
    return {
        tempMailBucket: fromEnv('TEMP_MAIL_BUCKET'),
        destinationBucket: fromEnv('DESTINATION_BUCKET')
    }
}