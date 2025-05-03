# Use the official AWS base image for Lambda with Node.js
FROM public.ecr.aws/lambda/nodejs18.x

# Set working directory
WORKDIR /var/task

# Copy package files and install
COPY package*.json ./
RUN npm ci

# Copy rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# Set handler to point to Next.js server
CMD [ "server.handler" ]
