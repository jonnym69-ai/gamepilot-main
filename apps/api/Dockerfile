FROM node:18-alpine

WORKDIR /app

# Copy all package files for monorepo
COPY package*.json ../../packages/shared/package.json ../../packages/types/package.json ../../packages/static-data/package.json ./

# Copy shared packages
COPY ../../packages/shared ./packages/shared
COPY ../../packages/types ./packages/types  
COPY ../../packages/static-data ./packages/static-data

# Install all dependencies including monorepo packages
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
