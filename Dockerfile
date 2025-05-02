FROM public.ecr.aws/lambda/nodejs:18

# Copy package.json and package-lock.json
COPY package*.json ${LAMBDA_TASK_ROOT}/

# Install dependencies
RUN npm ci

# Copy rest of the application
COPY . ${LAMBDA_TASK_ROOT}/

# Build the application
RUN npm run build

# Set the handler
CMD [ "dist/index.handler" ] 