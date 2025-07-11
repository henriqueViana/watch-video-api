FROM node:22

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn global add @nestjs/cli@10.0.0

RUN yarn install

COPY . .

CMD ["yarn", "start:dev"]