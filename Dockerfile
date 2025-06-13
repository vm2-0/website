FROM node:20-slim

WORKDIR /usr/src/app/frontend

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

RUN npm run build

# Expose port 5173 (Vite's default port)
EXPOSE 5173
