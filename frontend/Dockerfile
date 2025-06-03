FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:stable
COPY --from=builder /app/dist/your-app-name /usr/share/nginx/html
