FROM node:16.14-alpine AS builder

RUN mkdir -p /usr/src/trudesk
WORKDIR /usr/src/trudesk

COPY . /usr/src/trudesk

RUN apk add --no-cache --update bash make gcc g++ python3
# RUN apk add --no-cache --update bash make gcc g++
RUN yarn plugin import workspace-tools
RUN yarn workspaces focus --all --production
RUN cp -R node_modules prod_node_modules
RUN yarn install
RUN yarn build
RUN rm -rf node_modules && mv prod_node_modules node_modules
RUN rm -rf .yarn/cache

FROM node:16.14-alpine
WORKDIR /usr/src/trudesk
RUN apk add --no-cache ca-certificates bash mongodb-tools && rm -rf /tmp/*
COPY --from=builder /usr/src/trudesk .

EXPOSE 8118

CMD [ "/bin/bash", "/usr/src/trudesk/startup.sh" ]
