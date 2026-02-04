FROM node:18-alpine

WORKDIR /app

# Copy standalone package.json (now includes monorepo deps)
COPY package.standalone.json ./package.json

# Copy shared packages for file: dependencies
COPY ../../packages/shared ./packages/shared
COPY ../../packages/types ./packages/types
COPY ../../packages/static-data ./packages/static-data

# Install dependencies including monorepo packages
RUN npm install --only=production

# Copy source code
COPY . .

# Copy pre-built dist files
COPY dist ./dist

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
