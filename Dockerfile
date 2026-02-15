# syntax=docker/dockerfile:1

FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npx vite build

FROM node:20-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY backend/src ./src

COPY --from=frontend-build /app/frontend/dist ./public

USER appuser

EXPOSE 3015

CMD ["node", "src/server.js"]
