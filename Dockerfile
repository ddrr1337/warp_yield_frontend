# Usa una imagen de Node.js
FROM node:18.18-alpine3.18

COPY . /app
WORKDIR /app

# Instala las dependencias
RUN npm install

# Construye la aplicación

RUN npm run build

CMD ["npm","start"]