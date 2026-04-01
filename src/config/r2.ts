import { S3Client } from '@aws-sdk/client-s3';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
}

export const r2 = new S3Client({
  region: 'auto',
  endpoint: requiredEnv('R2_ENDPOINT'),
  credentials: {
    accessKeyId: requiredEnv('R2_ACCESS_KEY_ID'),
    secretAccessKey: requiredEnv('R2_SECRET_ACCESS_KEY'),
  },
});
