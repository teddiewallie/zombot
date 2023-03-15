FROM node:lts-alpine

WORKDIR /zombot

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "init.mjs" ]
