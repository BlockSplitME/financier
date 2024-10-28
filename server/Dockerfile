# Используем базовый образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем системные зависимости для SQLite
RUN apk add --no-cache sqlite-libs sqlite-dev

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Открываем порт
ARG PORT
EXPOSE $PORT

# Запускаем приложение
CMD ["npm", "run", "start"]