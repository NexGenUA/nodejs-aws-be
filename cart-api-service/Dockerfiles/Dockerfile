# Base
FROM node:erbium-alpine3.9 AS base

WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm install

# Build
WORKDIR /app
COPY . .
RUN npm run build

# couchbase sdk requirements
RUN apk update && apk add curl bash && rm -rf /var/cache/apk/*

# install node-prune
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

# remove development dependencies
RUN npm prune --production

# run node prune
RUN /usr/local/bin/node-prune

# remove unused dependencies and files
RUN rm -rf node_modules/rxjs/src/
RUN rm -rf node_modules/rxjs/bundles/
RUN rm -rf node_modules/rxjs/_esm5/
RUN rm -rf node_modules/rxjs/_esm2015/
RUN find . -name '*.md' -exec rm -f {} \;
RUN find . -name '*.map' -exec rm -f {} \;
RUN find . -name '*.ts' -exec rm -f {} \;

# Application
FROM alpine:3.9 AS application

# install node.js tini
RUN apk add --no-cache nodejs-current tini

# copy application files
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist

ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/main.js"]
