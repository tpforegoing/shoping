# Інструкція з розгортання проекту Shoping

Ця інструкція описує процес розгортання проекту Shoping як для розробки, так і для продакшену.

## Зміст

1. [Вимоги](#вимоги)
2. [Розгортання для розробки](#розгортання-для-розробки)
   - [Бекенд (Django)](#бекенд-django-розробка)
   - [Фронтенд (Angular)](#фронтенд-angular-розробка)
3. [Розгортання для продакшену](#розгортання-для-продакшену)
   - [Бекенд (Django)](#бекенд-django-продакшен)
   - [Фронтенд (Angular)](#фронтенд-angular-продакшен)
4. [Налаштування бази даних](#налаштування-бази-даних)
5. [Налаштування CORS](#налаштування-cors)
6. [Налаштування статичних файлів](#налаштування-статичних-файлів)
7. [Налаштування HTTPS](#налаштування-https)
8. [Моніторинг та логування](#моніторинг-та-логування)

## Вимоги

### Загальні вимоги
- Git
- Python 3.10+
- Node.js 18+ та npm
- PostgreSQL (для продакшену)

### Бекенд
- Django 5.2
- Django REST Framework
- Knox для токен-автентифікації
- django-environ для змінних середовища

### Фронтенд
- Angular 19.2.7
- TypeScript
- NgRx
- Angular Material

## Розгортання для розробки

### Бекенд (Django) (розробка)

1. **Клонування репозиторію**
   ```bash
   git clone https://github.com/tpforegoing/shoping/
   cd Shoping
   ```

2. **Створення віртуального середовища**
   ```bash
   # Windows
   python -m venv env
   env\Scripts\activate

   # Linux/Mac
   python -m venv env
   source env/bin/activate
   ```

3. **Встановлення залежностей**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Створення файлу .env**
   Створіть файл `.env` в директорії `backend` з наступним вмістом:
   ```
   DEBUG=True
   SECRET_KEY=your-secret-key
   ALLOWED_HOSTS=localhost,127.0.0.1
   DATABASE_URL=sqlite:///db.sqlite3
   ```

5. **Міграція бази даних**
   ```bash
   python manage.py migrate
   ```

6. **Створення суперкористувача**
   ```bash
   python manage.py createsuperuser
   ```

7. **Запуск сервера розробки**
   ```bash
   python manage.py runserver
   ```

### Фронтенд (Angular) (розробка)

1. **Перехід у директорію фронтенду**
   ```bash
   cd frontend
   ```

2. **Встановлення залежностей**
   ```bash
   npm install
   ```

3. **Запуск сервера розробки**
   ```bash
   ng serve
   ```

4. **Доступ до додатку**
   Відкрийте браузер і перейдіть за адресою `http://localhost:4200/`

## Розгортання для продакшену

### Бекенд (Django) (продакшен)

1. **Налаштування сервера**
   Встановіть необхідні пакети на сервері:
   ```bash
   sudo apt update
   sudo apt install python3 python3-pip python3-venv nginx postgresql postgresql-contrib
   ```

2. **Клонування репозиторію**
   ```bash
   git clone <repository-url>
   cd Shoping
   ```

3. **Створення віртуального середовища**
   ```bash
   python3 -m venv env
   source env/bin/activate
   ```

4. **Встановлення залежностей**
   ```bash
   cd backend
   pip install -r requirements.txt
   pip install gunicorn
   ```

5. **Створення файлу .env**
   Створіть файл `.env` в директорії `backend` з наступним вмістом:
   ```
   DEBUG=False
   SECRET_KEY=your-production-secret-key
   ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
   DATABASE_URL=postgres://shoping_user:your_password@localhost:5432/shoping
   ```

6. **Налаштування бази даних PostgreSQL**
   ```bash
   sudo -u postgres psql
   ```
   ```sql
   CREATE DATABASE shoping;
   CREATE USER shoping_user WITH PASSWORD 'your_password';
   ALTER ROLE shoping_user SET client_encoding TO 'utf8';
   ALTER ROLE shoping_user SET default_transaction_isolation TO 'read committed';
   ALTER ROLE shoping_user SET timezone TO 'UTC';
   GRANT ALL PRIVILEGES ON DATABASE shoping TO shoping_user;
   \q
   ```

7. **Міграція бази даних**
   ```bash
   python manage.py migrate --settings=shoping.settings.prod
   ```

8. **Збір статичних файлів**
   ```bash
   python manage.py collectstatic --settings=shoping.settings.prod
   ```

9. **Налаштування Gunicorn**
   Створіть файл `gunicorn.service` в `/etc/systemd/system/`:
   ```
   [Unit]
   Description=gunicorn daemon
   After=network.target

   [Service]
   User=<your-user>
   Group=www-data
   WorkingDirectory=/path/to/Shoping/backend
   ExecStart=/path/to/Shoping/env/bin/gunicorn --workers 3 --bind unix:/path/to/Shoping/backend/shoping.sock shoping.wsgi:application --env DJANGO_SETTINGS_MODULE=shoping.settings.prod

   [Install]
   WantedBy=multi-user.target
   ```

10. **Запуск Gunicorn**
    ```bash
    sudo systemctl start gunicorn
    sudo systemctl enable gunicorn
    ```

### Фронтенд (Angular) (продакшен)

1. **Оновлення змінних середовища**
   Відредагуйте файл `frontend/src/environments/environment.prod.ts`:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://yourdomain.com',
     auth: {
       tokenStorageKey: 'auth_token'
     }
   };
   ```

2. **Збірка проекту**
   ```bash
   cd frontend
   npm install
   ng build --configuration production
   ```

3. **Налаштування Nginx**
   Створіть файл конфігурації в `/etc/nginx/sites-available/shoping`:
   ```
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location /api {
           include proxy_params;
           proxy_pass http://unix:/path/to/Shoping/backend/shoping.sock;
       }

       location /admin {
           include proxy_params;
           proxy_pass http://unix:/path/to/Shoping/backend/shoping.sock;
       }

       location /static/ {
           alias /path/to/Shoping/backend/static/;
       }

       location / {
           root /path/to/Shoping/frontend/dist/frontend;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **Активація конфігурації Nginx**
   ```bash
   sudo ln -s /etc/nginx/sites-available/shoping /etc/nginx/sites-enabled
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Налаштування бази даних

### SQLite (розробка)
SQLite використовується за замовчуванням для розробки. Налаштування вже включені в `backend/shoping/settings/dev.py`.

### PostgreSQL (продакшен)
Для продакшену рекомендується використовувати PostgreSQL. Налаштування вже включені в `backend/shoping/settings/prod.py`.

## Налаштування CORS

Для розробки CORS налаштовано в `backend/shoping/settings/dev.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
]
CORS_ALLOW_CREDENTIALS = True
```

Для продакшену додайте відповідні налаштування в `backend/shoping/settings/prod.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]
CORS_ALLOW_CREDENTIALS = True
```

## Налаштування статичних файлів

Для продакшену додайте наступні налаштування в `backend/shoping/settings/prod.py`:
```python
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'static'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

## Налаштування HTTPS

Для забезпечення безпеки рекомендується налаштувати HTTPS. Можна використати Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Додайте наступні налаштування в `backend/shoping/settings/prod.py`:
```python
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000  # 1 рік
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
```

## Моніторинг та логування

Для логування додайте наступні налаштування в `backend/shoping/settings/prod.py`:
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs/django.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
```

Створіть директорію для логів:
```bash
mkdir -p /path/to/Shoping/backend/logs
```
