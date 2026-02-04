FROM node:18-alpine

WORKDIR /app

# Copy the entire monorepo structure
COPY . ./

# Install all dependencies including monorepo packages
RUN npm install

# Build the application
RUN npm run build

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
