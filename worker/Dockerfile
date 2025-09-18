FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

FROM base AS build

COPY . .
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY package*.json ./

USER node

CMD ["npm", "start"]
