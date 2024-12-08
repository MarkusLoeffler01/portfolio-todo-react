FROM node:23-alpine AS builder

WORKDIR /app

RUN npm i -g typescript

COPY package*.json ./

RUN npm ci

COPY . .


RUN npm run build

FROM nginx:alpine


COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]