# -------- Stage 1: Build Next.js app --------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy Next.js app files
COPY package*.json ./
COPY . .

# Add build argument
ARG NEXT_PUBLIC_CDN_URL
ENV NEXT_PUBLIC_CDN_URL=${NEXT_PUBLIC_CDN_URL}

# Install deps and build
RUN npm ci && npm run build
    

# -------- Stage 2: Build Lambda runtime --------
FROM public.ecr.aws/lambda/nodejs:18

# Set working directory in Lambda container
WORKDIR /var/task

# Copy Lambda package.json and install Lambda-specific deps
COPY lambda/package*.json ./
RUN npm install

# Copy Lambda server code
COPY lambda/server.js ./

# Copy built Next.js app from builder stage
COPY --from=builder /app/.next .next
# COPY --from=builder /app/next.config.js .
# COPY --from=builder /app/public public

# Set Lambda handler
CMD [ "server.handler" ]