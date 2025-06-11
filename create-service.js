const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const serviceName = process.argv[2];

if (!serviceName) {
  console.error(
    "❌ Please provide a service name. Example: node create-service.js product-service"
  );
  process.exit(1);
}

const servicePath = path.join(__dirname, serviceName);
if (fs.existsSync(servicePath)) {
  console.error("❌ Folder already exists");
  process.exit(1);
}

// ---- TEMPLATE CONFIGS ---- //
const tsconfig = {
  compilerOptions: {
    target: "ES2020",
    module: "commonjs",
    rootDir: "./src",
    outDir: "./dist",
    strict: true,
    esModuleInterop: true,
  },
};

const prettierConfig = {
  semi: true,
  singleQuote: true,
  trailingComma: "none",
  printWidth: 100,
  tabWidth: 2,
};

const prettierIgnore = `dist
node_modules
.env
.vscode
coverage
`;

const packageJson = {
  name: serviceName,
  version: "1.0.0",
  main: "index.js",
  license: "MIT",
  scripts: {
    dev: "ts-node-dev --respawn --transpile-only src/index.ts",
    build: "tsc",
    start: "node dist/index.js",
    lint: "eslint 'src/**/*.{ts,tsx}'",
    "lint:fix": "eslint 'src/**/*.{ts,tsx}' --fix",
    format: "prettier --write .",
  },
  dependencies: {
    "@types/morgan": "^1.9.10",
    "@typescript-eslint/eslint-plugin": "^8.33.1",
    "@typescript-eslint/parser": "^8.33.1",
    axios: "^1.9.0",
    bcryptjs: "^3.0.2",
    cors: "^2.8.5",
    dotenv: "^16.5.0",
    express: "^5.1.0",
    "express-validator": "^7.2.1",
    jsonwebtoken: "^9.0.2",
    mongoose: "^8.15.1",
    morgan: "^1.10.0",
  },
  devDependencies: {
    "@types/bcryptjs": "^3.0.0",
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.3",
    "@types/jsonwebtoken": "^9.0.9",
    "@types/node": "^22.15.30",
    eslint: "^9.28.0",
    "eslint-config-prettier": "^10.1.5",
    "eslint-plugin-prettier": "^5.4.1",
    prettier: "^3.5.3",
    "ts-node-dev": "^2.0.0",
    typescript: "^5.8.3",
  },
};

// ---- FILE STRUCTURE ---- //
console.log(`🚀 Creating ${serviceName}...`);
fs.mkdirSync(servicePath);
fs.mkdirSync(path.join(servicePath, "src"));
fs.mkdirSync(path.join(servicePath, "src", "config"));
fs.mkdirSync(path.join(servicePath, "src", "routes"));
fs.mkdirSync(path.join(servicePath, "src", "controllers"));
fs.mkdirSync(path.join(servicePath, "src", "utils"));
fs.mkdirSync(path.join(servicePath, ".vscode"));

// src/index.ts
fs.writeFileSync(
  path.join(servicePath, "src", "index.ts"),
  `import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db';
import { globalErrorHandler } from './utils/error-handler';
import sampleRoutes from './routes/sample.routes';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => res.send('${serviceName} is running ✅'));
app.use('/', sampleRoutes);
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`✅ ${serviceName} running on port \${PORT}\`);
});
`
);

// src/config/db.ts
fs.writeFileSync(
  path.join(servicePath, "src", "config", "db.ts"),
  `import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(\`✅ MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
`
);

// src/utils/error-handler.ts
fs.writeFileSync(
  path.join(servicePath, "src", "utils", "error-handler.ts"),
  `import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong'
  });
};
`
);

// Sample route/controller
fs.writeFileSync(
  path.join(servicePath, "src", "routes", "sample.routes.ts"),
  `import { Router } from 'express';
import { sampleController } from '../controllers/sample.controller';

const router = Router();
router.get('/sample', sampleController);
export default router;
`
);

fs.writeFileSync(
  path.join(servicePath, "src", "controllers", "sample.controller.ts"),
  `import { Request, Response } from 'express';

export const sampleController = (_req: Request, res: Response) => {
  res.json({ message: 'Sample controller working ✅' });
};
`
);

// Misc configs
fs.writeFileSync(path.join(servicePath, ".env"), "PORT=5000\nMONGO_URI=\n");

fs.writeFileSync(
  path.join(servicePath, "tsconfig.json"),
  JSON.stringify(tsconfig, null, 2)
);

fs.writeFileSync(
  path.join(servicePath, ".prettierrc.json"),
  JSON.stringify(prettierConfig, null, 2)
);

fs.writeFileSync(path.join(servicePath, ".prettierignore"), prettierIgnore);

fs.writeFileSync(
  path.join(servicePath, ".eslintrc.json"),
  JSON.stringify(
    {
      env: { node: true, es2021: true },
      parser: "@typescript-eslint/parser",
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
      ],
      plugins: ["@typescript-eslint", "prettier"],
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
      rules: { "prettier/prettier": "error", "no-console": "off" },
    },
    null,
    2
  )
);

fs.writeFileSync(
  path.join(servicePath, ".vscode", "settings.json"),
  JSON.stringify(
    {
      "editor.formatOnSave": true,
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
      },
      "eslint.validate": ["javascript", "typescript"],
      "files.exclude": {
        dist: true,
        node_modules: true,
      },
    },
    null,
    2
  )
);

fs.writeFileSync(
  path.join(servicePath, "package.json"),
  JSON.stringify(packageJson, null, 2)
);

console.log("📦 Installing dependencies...");
execSync(`cd ${serviceName} && yarn install`, { stdio: "inherit" });

console.log(`✅ ${serviceName} is ready to go!`);
