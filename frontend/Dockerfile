# STAGE 1: Compile the React application using Node 24
FROM node:24 AS build-stage
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy your source code and compile the static production bundle
COPY . ./
RUN npm run build

# STAGE 2: Use a clean space to hold the files
FROM alpine:latest
WORKDIR /var/www/frontend

# Copy the static built files over from STAGE 1
COPY --from=build-stage /app/build .

# Keep the container alive as a data volume host
CMD ["sh"]