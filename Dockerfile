# Stage 1: Builder
# This stage installs all dependencies, including devDependencies,
# and builds the SvelteKit application.
FROM node:20-slim AS builder
WORKDIR /usr/src/app/frontend

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application source code
COPY . .
RUN npm run build


# Stage 2: Production
# This stage creates the final, lean production image. It starts from a
# fresh base, installs only production dependencies, and copies the
# built artifacts from the builder stage.
FROM node:20-slim AS production
WORKDIR /usr/src/app/frontend

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the build output from the builder stage
COPY --from=builder /usr/src/app/frontend/build ./build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
