# Stage 1: Build the frontend assets
FROM node:20-alpine AS builder

WORKDIR /app

# Copy configuration files
COPY package*.json ./
COPY tsconfig.json tsconfig.node.json ./
COPY vite.config.ts postcss.config.js tailwind.config.ts ./

# Install all dependencies to build the frontend
RUN npm ci

# Copy the rest of the source code
COPY src ./src
COPY public ./public

# Build the frontend
RUN npm run build

# Stage 2: Production server
FROM node:20-alpine

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy backend code
COPY backend ./backend

# Copy built frontend from the builder stage
COPY --from=builder /app/dist ./dist

# The 'public/appdata' directory will be mounted as a volume by Coolify.
# The application should create the directory if it doesn't exist.
# Let's ensure the parent directory exists.
RUN mkdir -p public/appdata

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
