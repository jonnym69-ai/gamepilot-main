FROM node:18-alpine

WORKDIR /app

# Copy monorepo packages
COPY packages ./packages

# Build all internal packages
RUN cd packages/shared && npm install && npm run build
RUN cd packages/static-data && npm install && npm run build
RUN cd packages/types && npm install && npm run build

# Copy API source code
COPY apps/api .

# Expose port
EXPOSE 3001

# Start application
CMD ["npm", "start"]
