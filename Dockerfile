FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Build the app
RUN CI=true npm run build

# Serve the app
EXPOSE 3000
CMD ["npx", "serve", "-s", "build"]