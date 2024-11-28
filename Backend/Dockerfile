FROM node:20-alpine
ENV NODE_OPTIONS="--max-old-space-size=10240"

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

CMD ["npm", "start"]