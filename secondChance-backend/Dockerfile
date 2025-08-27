FROM node:18-bullseye-slim

WORKDIR /usr/src/app

# Copy package files first
COPY package*.json ./

# Install dependencies ignoring peer conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Expose application port
EXPOSE 3060

# Start the application
CMD ["node", "app.js"]
