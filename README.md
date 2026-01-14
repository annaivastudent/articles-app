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
```

## Frontend
```bash
cd frontend
npm install
npm start
```
Приложение откроется в браузере по адресу: http://localhost:3000

## Запуск миграций
1. Создать базу данных.
2. Выполнить:
```bash
npx sequelize-cli db:migrate
```
3. Для отката:
```bash
npx sequelize-cli db:migrate:undo
```

## Основные API‑маршруты
Аутентификация
```bash
POST /auth/register
POST /auth/login
```
Пользователи (admin)
```bash
GET /users
PUT /users/:id/role
```
Статьи
```bash
POST /articles
GET /articles
GET /articles/:id
PUT /articles/:id/edit
DELETE /articles/:id
```
Версии статей
```bash
PUT /articles/:id
GET /articles/:id/versions
```