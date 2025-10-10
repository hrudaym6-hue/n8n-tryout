# Use official Node.js image
FROM node:18

# Create and set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose the port your backend uses
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
