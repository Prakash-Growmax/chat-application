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

# Install serve globally
RUN npm install -g serve

# Use PORT environment variable
ENV PORT=3000
EXPOSE ${PORT}

# Serve from 'dist' directory and use PORT env variable
CMD serve -s dist -l ${PORT}

FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .


RUN CI=true npm run build

# Install serve globally
RUN npm install -g serve

ENV PORT=3000
EXPOSE ${PORT}

CMD serve -s dist -l ${PORT}