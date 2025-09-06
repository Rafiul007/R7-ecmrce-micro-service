import dotenv from "dotenv";
dotenv.config();

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`❌ Missing env var ${name}`);
  return val;
}

export const services = {
  auth: requireEnv("AUTH_SERVICE_URL"),
  customer: requireEnv("CUSTOMER_SERVICE_URL"),
  category: requireEnv("CATEGORY_SERVICE_URL"),
  // product: requireEnv("PRODUCT_SERVICE_URL"),
};
