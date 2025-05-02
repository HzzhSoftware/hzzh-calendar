FROM public.ecr.aws/lambda/nodejs:18

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --production

# Copy application code
COPY . .

# Build the Next.js application
RUN npm run build

# Set the Lambda handler
CMD [ "node_modules/.next/server/pages/api/lambda.js" ] 