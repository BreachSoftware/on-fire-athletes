# Use a Node.js base image
FROM node:18-slim

# Install dependencies for Puppeteer
RUN apt-get update && \
    apt-get install -y wget gnupg ca-certificates && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/containers/mind-compiler/package*.json ./

# Install dependencies
RUN npm install

# Copy the compile script
COPY backend/containers/mind-compiler/compile.js ./ecsRunner/

# Command to run the script
CMD ["node", "ecsRunner/compile.js"]