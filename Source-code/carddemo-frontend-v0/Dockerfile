# Stage 1: Build Angular app
FROM node:20.19.0 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular files to Nginx's html directory
COPY --from=build /app/dist/carddemo-frontend/browser /usr/share/nginx/html/

# Expose port Nginx serves on
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
