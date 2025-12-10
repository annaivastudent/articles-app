# Articles App — Backend

Backend‑часть приложения для работы со статьями, файлами, комментариями и рабочими пространствами.

## Технологии
- **Node.js / Express**
- **PostgreSQL**
- **Sequelize ORM**
- **Multer** (загрузка файлов)
- **WebSocket** (уведомления)
- **Sequelize Migrations**

---

## 1. Установка зависимостей
Перейдите в папку `backend` и установите зависимости:
```bash
cd backend
npm install

## Version Control for Articles

### API
- POST /articles → создать статью
- PUT /articles/:id → создать новую версию
- GET /articles/:id/versions → список всех версий
- Старые версии доступны только для чтения

### Setup
1. Run `npx sequelize-cli db:migrate`
2. Create article
3. Update article → новая версия
4. View versions

