FROM node:18-alpine

WORKDIR /app

# Copy standalone package.json
COPY package.json ./package.json

# Install dependencies
RUN npm install --only=production

# Copy API source code and embedded shared package
COPY apps/api .

# Build all internal packages
RUN cd packages/shared && npm install && npm run build
RUN cd packages/static-data && npm install && npm run build
RUN cd packages/types && npm install && npm run build

# Expose port
EXPOSE 3001

# Start application
CMD ["npm", "start"]
