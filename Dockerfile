FROM node:18-alpine

WORKDIR /app

# Copy standalone package.json
COPY package.json ./package.json

# Install dependencies
RUN npm install --only=production

# Copy API source code and pre-built dist
COPY apps/api .

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
