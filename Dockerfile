# Use Node 18 LTS
FROM node:18-slim

# Create app directory
WORKDIR /app

# Install dependencies first (leverage Docker layer caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
