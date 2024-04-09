import { S3Client } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-provider-env';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

export default s3;
