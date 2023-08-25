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



#for dev
FROM base as consumers

#ENV NODE_ENV=dev

RUN apk add supervisor --update

WORKDIR /var/www

COPY --from=linter /var/www ./

ADD supervisord.conf /etc/supervisord.conf
RUN mkdir -p /etc/supervisor.d
ADD supervisor.conf /etc/supervisor.d/supervisor.conf

RUN mkdir -p /var/log/supervisor

CMD /usr/bin/supervisord -n -c /etc/supervisord.conf

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
