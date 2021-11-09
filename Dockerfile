FROM node:14.17.6 as builder
RUN mkdir -p /app
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY .  /app/
RUN npm run build

FROM node:14.18-alpine as development
RUN mkdir -p /app
WORKDIR /app
COPY package*.json /app/
RUN npm install --production
COPY --from=builder /app/dist .
ENTRYPOINT ["node", "server.js"]