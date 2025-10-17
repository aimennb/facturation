FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
COPY tsconfig*.json nest-cli.json .
COPY src ./src
RUN npm install
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]
