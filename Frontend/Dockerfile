FROM node:20-alpine
ENV NODE_OPTIONS="--max-old-space-size=6144"
WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

# Start the application with npm run dev
CMD ["npm", "run", "dev"]
