# ----- Build Stage -----
FROM node:18 AS build

WORKDIR /app

# Copy lock files first
COPY package.json ./
COPY package-lock.json ./

# Clean install based on lockfile
RUN npm ci

# Copy rest of the app
COPY . .

# Build the Vite app
RUN npm run build


# ----- Serve Stage -----
FROM nginx:alpine

# Copy the built app from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
