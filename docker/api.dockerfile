# base
FROM node:18.17.1-alpine AS base

RUN apk add inotify-tools \
   && apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

WORKDIR /var/www

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .

# for lint
FROM base as linter

WORKDIR /var/www

RUN npm run lint

# for tests
FROM base as test

ENV NODE_ENV=test

WORKDIR /var/www

#RUN npm test

#for dev
FROM base as dev

#ENV NODE_ENV=dev

WORKDIR /var/www

COPY --from=linter /var/www ./

ENTRYPOINT [ "npm", "run", "dev" ]

# for build
FROM linter as builder

WORKDIR /var/www

RUN npm run build

# for production

FROM node:18.17.1-alpine as production

ENV NODE_ENV=production

RUN apk add inotify-tools \
   && apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

WORKDIR /var/www

COPY package*.json ./

RUN npm install --only=production

COPY --from=builder /var/www/dist ./

ENTRYPOINT [ "npm", "run", "prod" ]
