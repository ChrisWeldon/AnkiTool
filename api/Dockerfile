# syntax=docker/dockerfile:1

# node:14-alpine is used for sizing reasons to save on image-registry.
FROM node:14-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
CMD [ "node", "server.js" ]
