# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory to /frontend
WORKDIR /frontend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Expose port 3000 (assuming your React app runs on port 3000)
EXPOSE 3000

# Command to run the production server
CMD ["npm", "start"]
