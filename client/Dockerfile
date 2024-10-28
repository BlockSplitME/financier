# Используем базовый образ Node.js
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY ../client .

# Собираем проект
RUN npm run build

# Открываем порт
ARG PORT
EXPOSE $PORT

# Запускаем приложение
CMD ["npm", "run", "serve"]