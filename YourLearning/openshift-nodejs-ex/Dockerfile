# Build node image from Docker Hub
FROM node:alpine3.16

# Make app directory in container and set working directory
RUN mkdir /app
WORKDIR /app

# Copy package.json to app directory
COPY package.json /app
# Install node packages
RUN npm install
# Copy all to app directory
COPY . /app

# Expose server port
EXPOSE 8080

# Start application
CMD [ "node", "app.js" ]
