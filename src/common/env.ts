interface IVariables {
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

export function env(): IVariables {
  return {
    destinationBucket: fromEnv('DESTINATION_BUCKET'),
    tempMailBucket: fromEnv('TEMP_MAIL_BUCKET')
  };
}
