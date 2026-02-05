FROM node:18-alpine

WORKDIR /app

# Copy standalone package.json
COPY package.json ./package.json

# Install dependencies
RUN npm install --only=production

# Copy API source code and embedded shared package
COPY apps/api .

# Copy shared package (already built)
COPY packages/shared ./node_modules/@gamepilot/shared

# Expose port
EXPOSE 3001

# Start application
CMD ["npm", "start"]
