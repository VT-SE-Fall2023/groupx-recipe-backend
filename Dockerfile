FROM node:lts-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

ENV JWT_KEY "addkey"
# Expose the port the application will run on
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
