# syntax=docker/dockerfile:1

# ---- Stage 1: build ---------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# VITE_API_BASE_URL não é usada aqui de propósito: a URL da API é resolvida em
# runtime (ver src/lib/runtimeConfig.ts + docker/docker-entrypoint.sh), para que
# a mesma imagem sirva dev/staging/produção sem rebuild.
RUN npm run build

# ---- Stage 2: runtime (nginx) -----------------------------------------
FROM nginx:1.27-alpine AS runtime

RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
