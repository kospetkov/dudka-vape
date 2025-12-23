# Гайд по деплою Vape Shop

## Архитектура проекта

```
┌─────────────────────────────────────────────────────────────────┐
│                         ПРОДАКШЕН                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐      API       ┌──────────────────────────┐  │
│   │   Frontend   │ ◄────────────► │        Backend           │  │
│   │   (React)    │                │       (Node.js)          │  │
│   │              │                │                          │  │
│   │  Hostinger   │                │   Railway.app            │  │
│   │  Static      │                │   + MongoDB Atlas        │  │
│   │              │                │   + Cloudinary           │  │
│   └──────────────┘                └──────────────────────────┘  │
│    dudkavape.com                   web-production-139de.up.     │
│                                    railway.app                   │
└─────────────────────────────────────────────────────────────────┘
```

## Стек технологий

| Компонент | Технология | Назначение |
|-----------|------------|------------|
| Frontend | React 18 + Vite | SPA, быстрый UI |
| Backend | Node.js + Express | REST API |
| База данных | MongoDB Atlas | Хранение данных |
| Изображения | Cloudinary | CDN для медиа |
| Хостинг фронта | Hostinger | Статика |
| Хостинг бэка | Railway.app | Node.js сервер |

---

## Шаг 1: Деплой Backend на Railway

### 1.1 Подготовка репозитория

```bash
# Убедись что код запушен в GitHub
git add .
git commit -m "prepare for deploy"
git push origin feat/kimi-dev
```

### 1.2 Настройка Railway

1. Зайди на https://railway.app
2. **New Project** → **Deploy from GitHub repo**
3. Выбери репозиторий `kospetkov/dudka`
4. В **Settings** укажи:
   - **Root Directory:** `/server`
   - **Branch:** `feat/kimi-dev` (или `main`)

### 1.3 Environment Variables

В Railway → **Variables** добавь:

```env
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/vape-shop?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_key
PORT=5000
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 1.4 MongoDB Atlas — разрешить IP

1. MongoDB Atlas → **Network Access**
2. **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)

### 1.5 Проверка

```bash
curl https://your-app.up.railway.app/api/health
# Ожидаемый ответ: {"status":"OK","message":"Server is running"}
```

---

## Шаг 2: Деплой Frontend на Hostinger

### 2.1 Обновить API URL

В файле `client/.env`:

```env
VITE_API_URL=https://your-app.up.railway.app/api
```

### 2.2 Сбилдить проект

```bash
cd client
npm run build
```

### 2.3 Загрузить на Hostinger

1. **hPanel** → **File Manager** → `public_html`
2. **Сделать бекап** существующего содержимого (архивировать)
3. **Удалить** содержимое `public_html`
4. **Загрузить содержимое** папки `dist/`:
   - `index.html`
   - `assets/` (папка)

### 2.4 Проверка

Открыть https://dudkavape.com — должен загрузиться React SPA.

---

## Частые проблемы и решения

### 403 Forbidden на Hostinger
**Причина:** Загружена папка `dist/` вместо её содержимого.  
**Решение:** В `public_html` должен лежать `index.html` напрямую, не внутри подпапки.

### MongoDB Connection Error
**Причина:** IP Railway не в whitelist.  
**Решение:** MongoDB Atlas → Network Access → Add `0.0.0.0/0`

### CloudinaryStorage is not a constructor
**Причина:** ESM/CommonJS конфликт.  
**Решение:** Использовать default import:
```javascript
import pkg from 'multer-storage-cloudinary';
const CloudinaryStorage = pkg.CloudinaryStorage || pkg.default?.CloudinaryStorage || pkg;
```

### CORS ошибки
**Причина:** Backend не разрешает запросы с домена фронта.  
**Решение:** В `server.js` настроить CORS:
```javascript
app.use(cors({
  origin: ['https://dudkavape.com', 'http://localhost:3000']
}));
```

---

## Обновление продакшена

### Backend (автоматически)
```bash
git push origin feat/kimi-dev
# Railway автоматически передеплоит
```

### Frontend (вручную)
```bash
cd client
npm run build
# Загрузить содержимое dist/ в public_html через File Manager
```

---

## Полезные ссылки

- **Railway Dashboard:** https://railway.app/dashboard
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Cloudinary:** https://cloudinary.com/console
- **Hostinger hPanel:** https://hpanel.hostinger.com

---

## Контакты и доступы

| Сервис | URL | Примечание |
|--------|-----|------------|
| Production Frontend | https://dudkavape.com | Hostinger |
| Production Backend | https://web-production-139de.up.railway.app | Railway |
| API Health Check | /api/health | Проверка статуса |

---

*Последнее обновление: December 2025*
