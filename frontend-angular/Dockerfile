# ---- Stage 1: build Angular app ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# ---- Stage 2: servidor Nginx ----
FROM nginx:stable-alpine

# copiar artefactos del build de Angular
COPY --from=build /app/dist/frontend-angular/browser/ /usr/share/nginx/html/
COPY --from=build /app/dist/ /usr/share/nginx/html/

# usar nuestra config de SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
