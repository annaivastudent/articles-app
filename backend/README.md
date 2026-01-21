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

## Аутентификация (JWT)
- Используется middleware authMiddleware, которое:
- проверяет наличие токена
- валидирует его
- извлекает пользователя
- добавляет req.user во все защищённые маршруты
```bash
Authorization: Bearer <token>
```

## Роли пользователей (RBAC)
В системе есть две роли:
- user — обычный пользователь
- admin — администратор
При регистрации создаётся пользователь с ролью:
```bash
role: "user"
```
Администратор может менять роли других пользователей.

## User Management (только admin)
Получить список всех пользователей
```bash
GET /users
Authorization: Bearer <token>
```
Изменить роль пользователя
```bash
PUT /users/:id/role
Authorization: Bearer <token>
Body: { "role": "admin" | "user" }
```
Если пользователь не admin → backend возвращает: 403 Forbidden

## Работа со статьями
Создать статью
```bash
POST /articles
multipart/form-data
```
Поля:
- title
- content
- attachment (jpg, png, pdf)
- workspaceId
Получить список статей
```bash
GET /articles
```
Получить статью по ID
```bash
GET /articles/:id
```

## Редактирование статьи (RBAC)
Редактировать статью могут:
- её автор
- администратор
```bash
PUT /articles/:id/edit
```
Проверка прав:
```bash
const isOwner = article.userId === req.user.id;
const isAdmin = req.user.role === "admin";

if (!isOwner && !isAdmin) {
  return res.status(403).json({ error: "Forbidden" });
}
```

## Версионность статей
Каждое редактирование создаёт новую версию.
Создать версию
```bash
PUT /articles/:id
```
Получить список версий
```bash
GET /articles/:id/versions
```

## Удаление статьи (RBAC)
Удалять статью могут:
- автор
- администратор
```bash
DELETE /articles/:id
```
## Приложение поддерживает поиск статей по названию и содержимому.
Поиск регистронезависимый и работает через параметр search в запросе.

## Поиск встроен в существующий маршрут получения статей:
```bash
GET /articles?search=текст
```
## В маршруте GET /articles используется Sequelize и оператор Op.iLike