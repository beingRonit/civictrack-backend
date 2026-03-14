FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN chmod +x ./node_modules/.bin/tsc && ./node_modules/.bin/tsc --skipLibCheck

EXPOSE 3000

CMD ["node", "dist/server.js"]
