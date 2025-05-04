# Use the official AWS base image for Lambda with Node.js
FROM public.ecr.aws/lambda/nodejs:18

# Set working directory
WORKDIR /var/task

# Copy the lambda code
COPY lambda/ .

# Copy only the lambda folder into the container
RUN npm ci

# Build the Next.js app
RUN npm run build

# Set handler to point to Next.js server
CMD [ "server.handler" ]
