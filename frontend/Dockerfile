FROM node:20-slim

WORKDIR /app

COPY package.json yarn.lock ./
COPY . .

RUN yarn install
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
