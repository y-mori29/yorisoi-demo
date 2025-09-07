# Use Node.js 20 for Cloud Run
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port; Cloud Run will set PORT env variable
ENV PORT=8080

# Start the server
CMD ["npm", "start"]
