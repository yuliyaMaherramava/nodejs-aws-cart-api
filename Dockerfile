# Setup
FROM node:20-alpine AS base
WORKDIR /app
CMD node -r dotenv/config ./build/index.js

# Dependecies
FROM base AS dependencies
COPY package*.json ./
RUN npm install && npm cache clean --force

# Building
FROM dependencies AS build
COPY . .
RUN npm run build
FROM node:20-alpine AS final
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

USER node
ENV PORT 4000
EXPOSE 4000

CMD ["node", "dist/main.js"]