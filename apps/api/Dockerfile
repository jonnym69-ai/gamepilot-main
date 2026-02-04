FROM node:18-alpine

WORKDIR /app

# Copy standalone package.json (has all dependencies bundled)
COPY package.standalone.json ./package.json

# Install dependencies
RUN npm install --only=production

# Copy source code
COPY . .

# Copy pre-built dist files (skip build step for standalone)
COPY dist ./dist

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
