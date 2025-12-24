# Articles App — Backend

Backend‑часть приложения для работы со статьями, версиями, вложениями, комментариями и аутентификацией.  
Использует PostgreSQL, Sequelize ORM и Express.

## Технологии
- Node.js / Express
- PostgreSQL + Sequelize ORM
- Sequelize Migrations & Seeders
- Multer (загрузка файлов)
- JSON Web Tokens (JWT)
- bcrypt (хеширование паролей)
- WebSocket (уведомления)
- pgAdmin 4 (управление БД)

---

# Установка и запуск

## 1. Установить зависимости
```bash
cd backend
npm install
```

## 2. Создать базу данных
```bash
npx sequelize-cli db:create
```

## 3. Применить миграции
```bash
npx sequelize-cli db:migrate
```

## 4. Создать workspace
```bash
npx sequelize-cli db:seed:all
```

## Проверка версионности 
1. Создать статью → `POST /articles` 
2. Редактировать → `PUT /articles/:id` → создаётся новая версия 
3. Получить список версий → `GET /articles/:id/versions` 
4. Открыть старую версию → появляется баннер, редактирование недоступно