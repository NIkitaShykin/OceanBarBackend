FROM node:14.17.6
RUN mkdir -p /app
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY .  /app/
RUN npm run build
RUN rm -rf /app/src /app/node_modules
RUN npm install --only=production
CMD [ "node",  "/app/dist/server.js"]
