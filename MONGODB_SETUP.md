# MongoDB Atlas - Швидке Налаштування

## 1. Створення Акаунту (2 хвилини)

1. Перейдіть: https://www.mongodb.com/cloud/atlas/register
2. Зареєструйтесь через Google або Email
3. Підтвердіть email

## 2. Створення Безкоштовного Кластера (3 хвилини)

1. **Build a Database**
   - Натисніть зелену кнопку "Build a Database"

2. **Виберіть Plan**
   - **M0** - FREE ✅
   - Shared
   - 512 MB Storage
   - Натисніть "Create"

3. **Налаштування Кластера**
   - **Cloud Provider**: AWS (або будь-який)
   - **Region**: Frankfurt (eu-central-1) - найближче до України
   - **Cluster Name**: `vape-shop` (або залиште за замовчуванням)
   - Натисніть "Create Cluster"

⏳ Кластер створюється 1-3 хвилини

## 3. Налаштування Безпеки (2 хвилини)

### Database Access (Користувач)

1. Ліва панель → **Database Access**
2. Натисніть "+ ADD NEW DATABASE USER"
3. **Authentication Method**: Password
4. **Username**: `vapeshop`
5. **Password**: 
   - Натисніть "Autogenerate Secure Password"
   - **ЗБЕРЕЖІТЬ ПАРОЛЬ!** (скопіюйте в блокнот)
6. **Database User Privileges**: 
   - Виберіть "Read and write to any database"
7. Натисніть "Add User"

### Network Access (IP адреси)

1. Ліва панель → **Network Access**
2. Натисніть "+ ADD IP ADDRESS"
3. Натисніть "ALLOW ACCESS FROM ANYWHERE"
   - Це додасть `0.0.0.0/0`
   - Потрібно для Render.com та інших хостингів
4. Натисніть "Confirm"

## 4. Отримання Connection String (1 хвилина)

1. Ліва панель → **Database** (або **Clusters**)
2. Знайдіть ваш кластер
3. Натисніть кнопку "**Connect**"
4. Виберіть "**Drivers**"
5. **Driver**: Node.js
6. **Version**: 5.5 or later
7. **Скопіюйте Connection String**:

```
mongodb+srv://vapeshop:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## 5. Підготовка Connection String

Ваш connection string виглядає так:
```
mongodb+srv://vapeshop:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Змініть**:
1. Замініть `<password>` на ваш згенерований пароль
2. Додайте назву бази даних `/vape-shop` перед `?`

**Результат**:
```
mongodb+srv://vapeshop:ВАШ_ПАРОЛЬ@cluster0.xxxxx.mongodb.net/vape-shop?retryWrites=true&w=majority
```

## 6. Оновлення .env файлу

1. Відкрийте `server/.env`
2. Оновіть `MONGODB_URI`:

```env
MONGODB_URI=mongodb+srv://vapeshop:ВАШ_ПАРОЛЬ@cluster0.xxxxx.mongodb.net/vape-shop?retryWrites=true&w=majority
JWT_SECRET=vape_shop_secret_2024_change_in_production
PORT=5000
NODE_ENV=development
```

## 7. Тестування Підключення

```bash
# Зупиніть backend якщо запущений (Ctrl+C)

# Перезапустіть backend
cd server
npm run dev
```

**Очікуваний вивід**:
```
🚀 Server running on port 5000
📊 Environment: development
MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
✅ Cron jobs initialized: Parser scheduled for 8:00 AM Kyiv time
```

✅ Якщо бачите "MongoDB Connected" - все працює!

## 8. Створення Тестового Адміна

### Через MongoDB Compass (GUI)

1. Відкрийте MongoDB Compass (встановлюється з MongoDB)
2. Підключіться використовуючи ваш connection string
3. База даних: `vape-shop`
4. Колекція: `users`
5. Натисніть "Insert Document"
6. Вставте:

```json
{
  "email": "admin@vape-shop.com",
  "password": "$2a$10$YourHashedPassword",
  "name": "Admin",
  "phone": "+380123456789",
  "role": "admin",
  "orderHistory": [],
  "savedPaymentData": {
    "hasData": false
  }
}
```

### Простіший спосіб - через UI

1. Запустіть frontend: http://localhost:3000
2. Зареєструйтесь через UI
3. В MongoDB Compass знайдіть вашого користувача
4. Змініть поле `role` з `"user"` на `"admin"`

## 9. Запуск Парсера

```bash
# Через curl
curl -X POST http://localhost:5000/api/parser/trigger

# Або через браузер/Postman
POST http://localhost:5000/api/parser/trigger
```

**Очікуваний результат**:
```json
{
  "success": true,
  "message": "Parser completed",
  "parsedCount": 15,
  "updatedCount": 0
}
```

## 10. Перевірка

1. ✅ Backend запущений
2. ✅ MongoDB підключена
3. ✅ Парсер запустився
4. ✅ Товари додані в базу
5. ✅ Frontend показує товари
6. ✅ Можна зареєструватись
7. ✅ Можна створити замовлення

## Troubleshooting

### Помилка: "MongoServerError: bad auth"
- Перевірте пароль в connection string
- Пароль має бути без `<` та `>`
- Якщо пароль містить спецсимволи, закодуйте їх (URL encode)

### Помилка: "MongooseServerSelectionError"
- Перевірте Network Access - додано 0.0.0.0/0?
- Перевірте чи правильний connection string
- Спробуйте інший регіон кластера

### Помилка: "Authentication failed"
- Перевірте username та password
- Переконайтесь що користувач має права "Read and write to any database"

### Парсер не знаходить товари
- Структура сайту могла змінитись
- Перевірте селектори в `server/services/parser.js`
- Спробуйте вручну відкрити https://dartvaper.ua/catalog/vape-startovye-nabory/brand-vaporesso

## Готово! 🎉

Тепер ваш Vape Shop повністю функціональний з MongoDB Atlas!

**Наступні кроки**:
- Протестуйте всі функції
- Додайте більше товарів через парсер або вручну
- Задеплойте на Render.com (див. DEPLOYMENT.md)
