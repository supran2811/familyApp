FROM node:alpine

WORKDIR /app
RUN npm install -g ionic
COPY package.json .
RUN npm install --only=prod
COPY . .

CMD ["ionic","serve"]