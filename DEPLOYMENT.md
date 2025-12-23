# 🚀 Deployment Guide - Render.com

Повна інструкція по деплою Vape Shop на Render.com з автоматичним CI/CD через GitHub Actions.

## 📋 Передумови

- ✅ GitHub репозиторій: https://github.com/kospetkov/dudka
- ✅ MongoDB Atlas database
- ✅ Render.com account (безкоштовний)

---

## 🔧 Крок 1: Налаштування MongoDB Atlas

1. Перейдіть на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Створіть кластер (якщо ще не створили)
3. **Network Access** → Add IP Address → **Allow Access from Anywhere** (0.0.0.0/0)
4. **Database Access** → Add New Database User
5. Скопіюйте Connection String

---

## 🖥️ Крок 2: Deploy Backend на Render

### 2.1 Створення Web Service

1. Перейдіть на [Render Dashboard](https://dashboard.render.com/)
2. Натисніть **New** → **Web Service**
3. Підключіть GitHub репозиторій `kospetkov/dudka`
4. Налаштування:

```
Name: vape-shop-backend
Region: Frankfurt (EU Central)
Branch: main
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: node server.js
Instance Type: Free
```

### 2.2 Environment Variables

Додайте змінні середовища:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vape-shop
JWT_SECRET=your_super_secret_key_min_32_characters
PORT=5000
NODE_ENV=production
```

⚠️ **Важливо:** Замініть `username`, `password`, `cluster` на ваші дані з MongoDB Atlas

### 2.3 Deploy Hook

1. Після створення сервісу перейдіть в **Settings**
2. Прокрутіть до **Deploy Hook**
3. Скопіюйте URL (буде потрібен для GitHub Actions)
4. Збережіть як `RENDER_BACKEND_DEPLOY_HOOK`

---

## 🌐 Крок 3: Deploy Frontend на Render

### 3.1 Створення Static Site

1. **New** → **Static Site**
2. Підключіть той самий репозиторій
3. Налаштування:

```
Name: vape-shop-frontend
Branch: main
Root Directory: client
Build Command: npm install && npm run build
Publish Directory: dist
```

### 3.2 Environment Variables

```env
VITE_API_URL=https://vape-shop-backend.onrender.com
```

⚠️ Замініть URL на адресу вашого backend сервісу

### 3.3 Deploy Hook

1. **Settings** → **Deploy Hook**
2. Скопіюйте URL
3. Збережіть як `RENDER_FRONTEND_DEPLOY_HOOK`

---

## 🔐 Крок 4: Налаштування GitHub Secrets

1. Перейдіть на https://github.com/kospetkov/dudka
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret**

Додайте 2 секрети:

```
Name: RENDER_BACKEND_DEPLOY_HOOK
Value: https://api.render.com/deploy/srv-xxxxx?key=yyyyy

Name: RENDER_FRONTEND_DEPLOY_HOOK
Value: https://api.render.com/deploy/srv-zzzzz?key=wwwww
```

---

## ✅ Крок 5: Перевірка автоматичного деплою

### 5.1 Перший деплой

```bash
# Переконайтеся, що всі зміни закоммічені
git status

# Якщо є незакоммічені зміни
git add .
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

### 5.2 Моніторинг деплою

1. **GitHub**: Actions tab → Подивіться на workflow "Deploy to Render"
2. **Render**: Dashboard → Перевірте статус обох сервісів

### 5.3 Перевірка роботи

1. **Backend**: https://vape-shop-backend.onrender.com/api/health
   - Повинен повернути: `{"status":"OK","message":"Server is running"}`

2. **Frontend**: https://vape-shop-frontend.onrender.com
   - Повинен відкритися сайт з каруселлю та товарами

---

## 🔄 Автоматичний деплой

Тепер при кожному `git push origin main`:

1. ✅ GitHub Actions автоматично запуститься
2. ✅ Встановить залежності
3. ✅ Збілдить frontend
4. ✅ Викличе Render Deploy Hooks
5. ✅ Render автоматично задеплоїть оновлення

---

## 🐛 Troubleshooting

### Backend не стартує

**Перевірте:**
1. MongoDB URI правильний і IP whitelisted
2. Environment variables встановлені
3. Логи в Render Dashboard → Logs

### Frontend не підключається до Backend

**Перевірте:**
1. `VITE_API_URL` вказує на правильний backend URL
2. CORS налаштований в `server/server.js`
3. Backend доступний через `/api/health`

### GitHub Actions падає

**Перевірте:**
1. Secrets правильно встановлені
2. Deploy Hooks валідні
3. Логи в Actions tab

---

## 📊 Моніторинг

### Render Dashboard
- CPU/Memory usage
- Request logs
- Error logs
- Deploy history

### MongoDB Atlas
- Database size
- Connection count
- Query performance

---

## 💰 Вартість

### Free Tier (Render)
- ✅ Backend: Free (750 годин/місяць)
- ✅ Frontend: Free (100 GB bandwidth)
- ⚠️ Backend засинає після 15 хв неактивності
- ⚠️ Перший запит може бути повільним (cold start)

### Paid Tier ($7/міс за сервіс)
- ✅ Без cold starts
- ✅ Більше ресурсів
- ✅ Custom domains

---

## 🔗 Корисні посилання

- [Render Documentation](https://render.com/docs)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

---

## 📝 Наступні кроки

1. ✅ Налаштувати custom domain
2. ✅ Додати SSL сертифікат (автоматично на Render)
3. ✅ Налаштувати email notifications для деплоїв
4. ✅ Додати health checks
5. ✅ Налаштувати backup бази даних

---

**🎉 Готово! Ваш Vape Shop тепер в production!**
