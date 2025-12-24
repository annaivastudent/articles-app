# Articles App

Полноценное приложение для работы со статьями, версиями, вложениями и аутентификацией.  
Состоит из двух частей:

- **Backend:** Node.js + Express + PostgreSQL + Sequelize  
- **Frontend:** React + React Router + Axios  

---

# Возможности приложения

- Регистрация и логин пользователей (JWT)
- Защищённые маршруты
- Создание статей
- Редактирование статей с сохранением версий
- Просмотр старых версий
- Загрузка вложений (картинки, PDF)
- Уведомления в реальном времени (WebSocket)
- Полная интеграция frontend + backend

---

# Установка

## Backend
```bash
cd backend
npm install
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm start


- Frontend
cd frontend
npm install
npm start
Приложение откроется в браузере по адресу: http://localhost:3000

## Запуск миграций
1. Создать базу данных (см. шаг ниже).
2. Выполнить:
   ```bash
   npx sequelize-cli db:migrate
3. Для отката:
npx sequelize-cli db:migrate:undo