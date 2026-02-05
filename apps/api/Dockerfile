FROM node:18-alpine

WORKDIR /app

# Copy standalone package.json
COPY package.standalone.json ./package.json

# Install dependencies
RUN npm install --only=production

# Copy source code and pre-built dist
COPY . .

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy monorepo workspaces
COPY apps ./apps
COPY packages ./packages

# Install all dependencies (monorepo-aware)
RUN npm install

# Build shared package
RUN npm run build --workspace=@gamepilot/shared

# Build API
RUN npm run build --workspace=gamepilot-api

# ---- Production image ----
FROM node:18-alpine

WORKDIR /app

# Copy built API
COPY --from=builder /app/apps/api/dist ./dist

# Copy node_modules
COPY --from=builder /app/node_modules ./node_modules

ENV PORT=3001
EXPOSE 3001

CMD ["node", "dist/index.js"]