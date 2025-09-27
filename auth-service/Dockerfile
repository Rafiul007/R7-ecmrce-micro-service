# Use Node.js LTS (small alpine image)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package*.json yarn.lock* ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy rest of the app
COPY . .

# Build TypeScript
RUN yarn build

# Expose port
EXPOSE 3001

# Start service
CMD ["node", "dist/index.js"]
