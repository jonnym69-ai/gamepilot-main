FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.standalone.json ./package.json

# Install dependencies
RUN npm install --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1000 nodejs && adduser -D -u 1000 -G nodejs nodejs

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http://localhost:3001/health').then(() => process.exit(0)).catch(() => process.exit(1));"

# Start the application
CMD ["npm", "start"]
