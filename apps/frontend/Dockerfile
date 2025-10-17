FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
COPY tsconfig*.json vite.config.ts ./
COPY src ./src
COPY index.html ./
RUN npm install
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install serve
EXPOSE 4173
CMD ["npx", "serve", "-s", "dist", "-l", "4173"]
