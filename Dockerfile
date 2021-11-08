FROM node:14.17.6 as builder
RUN mkdir -p /app
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY .  /app/
RUN npm run build

FROM builder as development
EXPOSE 3000
CMD [ "npm", "run", "start"]