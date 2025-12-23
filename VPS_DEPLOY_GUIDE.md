# VPS Docker Deployment Guide

## Архитектура на VPS

```
┌─────────────────────────────────────────────────────────────────┐
│                        VPS (Ubuntu 24.04)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │
│   │   Nginx     │    │   Client    │    │      Server         │ │
│   │   :80/:443  │───►│   (React)   │    │     (Node.js)       │ │
│   │   SSL/Proxy │    │   :80       │    │      :5000          │ │
│   └─────────────┘    └─────────────┘    └─────────────────────┘ │
│          │                                        │              │
│          │              /api/*                    │              │
│          └────────────────────────────────────────┘              │
│                                                                  │
│   ┌─────────────────────┐                                       │
│   │      MongoDB        │                                       │
│   │       :27017        │                                       │
│   └─────────────────────┘                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Быстрый старт (первый деплой)

### 1. Подключение к VPS

```bash
ssh root@YOUR_VPS_IP
```

### 2. Установка Docker (если нет)

```bash
apt update && apt upgrade -y
apt install docker.io docker-compose -y
systemctl enable docker
systemctl start docker
```

### 3. Клонирование проекта

```bash
cd /opt
git clone https://github.com/kospetkov/dudka.git vape-shop
cd vape-shop
git checkout feat/kimi-dev
```

### 4. Настройка environment

**Server .env:**
```bash
cat > server/.env << 'EOF'
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/vape-shop?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret
PORT=5000
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EOF
```

**Client .env:**
```bash
cat > client/.env << 'EOF'
VITE_API_URL=https://YOUR_DOMAIN/api
EOF
```

### 5. Настройка Nginx (с SSL)

```bash
mkdir -p nginx certbot/www certbot/conf

cat > nginx/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    
    server {
        listen 80;
        server_name YOUR_DOMAIN;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            return 301 https://$host$request_uri;
        }
    }
    
    server {
        listen 443 ssl;
        server_name YOUR_DOMAIN;
        
        ssl_certificate /etc/letsencrypt/live/YOUR_DOMAIN/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/YOUR_DOMAIN/privkey.pem;
        
        location / {
            proxy_pass http://client:80;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
        
        location /api {
            proxy_pass http://server:5000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
EOF
```

### 6. Первый запуск (без SSL)

Временно уберите SSL блок из nginx.conf, запустите:

```bash
docker-compose up -d --build
```

### 7. Получение SSL сертификата

```bash
docker run -it --rm \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d YOUR_DOMAIN \
  --email your@email.com \
  --agree-tos \
  --no-eff-email
```

### 8. Включение SSL

Верните SSL блок в nginx.conf и перезапустите:

```bash
docker-compose restart nginx
```

---

## Обновление после изменений в коде

### Вариант 1: Полный редеплой

```bash
cd /opt/vape-shop
git pull origin feat/kimi-dev
docker-compose down
docker-compose up -d --build
```

### Вариант 2: Обновление только бэкенда

```bash
cd /opt/vape-shop
git pull origin feat/kimi-dev
docker-compose up -d --build server
```

### Вариант 3: Обновление только фронта

```bash
cd /opt/vape-shop
git pull origin feat/kimi-dev
docker-compose up -d --build client
docker-compose restart nginx
```

---

## Полезные команды

### Статус контейнеров
```bash
docker ps
```

### Логи
```bash
# Все логи
docker-compose logs -f

# Только сервер
docker-compose logs -f server

# Только клиент
docker-compose logs -f client

# Последние 100 строк
docker-compose logs --tail=100 server
```

### Перезапуск
```bash
# Всё
docker-compose restart

# Один сервис
docker-compose restart server
```

### Остановка
```bash
docker-compose down
```

### Полная очистка (с удалением данных)
```bash
docker-compose down -v
docker system prune -a
```

---

## Обновление SSL сертификата

Сертификат действует 90 дней. Автообновление:

```bash
# Добавить в crontab
crontab -e

# Добавить строку (обновление каждый месяц):
0 0 1 * * cd /opt/vape-shop && docker run --rm -v $(pwd)/certbot/conf:/etc/letsencrypt -v $(pwd)/certbot/www:/var/www/certbot certbot/certbot renew && docker-compose restart nginx
```

Или вручную:
```bash
cd /opt/vape-shop
docker run --rm \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  certbot/certbot renew
docker-compose restart nginx
```

---

## Мониторинг

### Использование ресурсов
```bash
docker stats
```

### Место на диске
```bash
df -h
docker system df
```

### Проверка здоровья API
```bash
curl https://YOUR_DOMAIN/api/health
```

---

## Troubleshooting

### Контейнер не запускается
```bash
docker-compose logs server
# Смотрим ошибки
```

### Нет подключения к MongoDB
1. Проверить .env файл
2. Проверить whitelist IP в MongoDB Atlas (добавить 0.0.0.0/0)

### 502 Bad Gateway
```bash
# Проверить что бэкенд запущен
docker ps
docker-compose logs server
```

### SSL не работает
```bash
# Проверить сертификаты
ls -la certbot/conf/live/YOUR_DOMAIN/
# Должны быть fullchain.pem и privkey.pem
```

---

## Структура файлов на сервере

```
/opt/vape-shop/
├── client/
│   ├── .env
│   ├── Dockerfile
│   └── ...
├── server/
│   ├── .env
│   ├── Dockerfile
│   └── ...
├── nginx/
│   └── nginx.conf
├── certbot/
│   ├── conf/          # SSL сертификаты
│   └── www/           # ACME challenge
├── docker-compose.yml
└── ...
```

---

## Контакты и доступы

| Ресурс | URL |
|--------|-----|
| Production | https://dev.dudkavape.com |
| API Health | https://dev.dudkavape.com/api/health |
| VPS IP | 72.62.1.224 |
| SSH | `ssh root@72.62.1.224` |

---

*Последнее обновление: December 2025*
