# ---- Client Dockerfile ----
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
# Build the Vite app
RUN npm run build

# Production stage - serve with nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Optional: copy custom nginx config if needed
# EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
