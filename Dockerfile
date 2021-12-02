FROM node:16-alpine

ENV BALENA_API_KEY todo
ENV BALENA_DEVICE_UUID todo

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY lib lib

CMD ["npm", "start"]