# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S taskflow -u 1001

# Copy built application from builder stage
COPY --from=builder --chown=taskflow:nodejs /app/dist ./dist
COPY --from=builder --chown=taskflow:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=taskflow:nodejs /app/package*.json ./

# Switch to non-root user
USER taskflow

# Expose port
EXPOSE 5000

# Install curl for health checks
RUN apk add --no-cache curl

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start application
CMD ["npm", "start"]