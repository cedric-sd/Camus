# Build
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
