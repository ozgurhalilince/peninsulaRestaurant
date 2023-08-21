FROM node:18.17.1-alpine

RUN apk add inotify-tools \
   && apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

WORKDIR /var/www

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "dev" ]