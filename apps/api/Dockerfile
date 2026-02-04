FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.standalone.json ./package.json

# Install dependencies
RUN npm install --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http://localhost:3001/health').then(() => process.exit(0)).catch(() => process.exit(1));"

# Start the application
CMD ["npm", "start"]
