import dotenv from 'dotenv';
dotenv.config();

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`❌ Missing env var ${name}`);
  return val;
}

export const services = {
  iam: requireEnv('IAM_SERVICE_URL'),
  'product-catalog': requireEnv('PRODUCT_CATELOG_SERVICE_URL'),
};

export default services;
