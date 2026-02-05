# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/shared/package*.json ./packages/shared/
COPY packages/static-data/package*.json ./packages/static-data/
COPY packages/types/package*.json ./packages/types/
COPY packages/config/package*.json ./packages/config/
COPY packages/integrations/package*.json ./packages/integrations/

# Install dependencies for the whole workspace
RUN npm install

# Copy source code
COPY . .

# Build internal packages in order
RUN npm run build:packages

# Build the API
RUN npm run build:api

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built artifacts and production dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package*.json ./apps/api/
COPY --from=builder /app/packages ./packages

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Start application using the root script
CMD ["npm", "run", "start", "--workspace=gamepilot-api"]