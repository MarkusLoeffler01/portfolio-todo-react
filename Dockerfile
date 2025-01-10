FROM node:23-alpine AS builder

RUN apk add --no-interactive git

WORKDIR /app

RUN npm i -g typescript

COPY package*.json ./

RUN npm i --silent

COPY . .

# Build mit dynamischem Base Path
ARG VITE_BASE_PATH=/todo/
ENV VITE_BASE_PATH=$VITE_BASE_PATH

ARG BUILD_TIMESTAMP
ARG BUILD_ID

ENV BUILD_TIMESTAMP=$BUILD_TIMESTAMP
ENV BUILD_ID=$BUILD_ID

RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist .

# Add metadata for debugging purposes
LABEL org.opencontainers.image.created=$BUILD_TIMESTAMP
LABEL org.opencontainers.image.revision=$BUILD_ID

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]