# 💼 Shoping — вебзастосунок для управління товарами, цінами, клієнтами та замовленнями

## 🔍 Огляд

**Shoping** — це повноцінний вебзастосунок для внутрішнього або публічного використання з підтримкою ролей, адміністрування товарів, управління цінами, клієнтами та замовленнями.

- **Backend**: Django 5.2 + DRF + Knox
- **Frontend**: Angular 19 + NgRx + Angular Material
- **БД**: SQLite (dev) / PostgreSQL (prod)
- **Авторизація**: токени через Knox

---

## ⚙️ Основні можливості

- 🔐 Аутентифікація через Knox
- 🧲 Управління товарами, категоріями, цінами
- 👤 Ролі: клієнт / менеджер
- 🛍️ Кошик та замовлення з деталями
- 📊 NgRx стан для Angular
- 📦 Денормалізовані поля для оптимізації

---

## 📂 Структура проєкту

```
shoping/
├── backend/    # Django API
├── frontend/   # Angular SPA
```

### Backend (Django)

- `/api/products/` — продукти
- `/api/category/` — категорії
- `/api/price/` — ціни
- `/api/customer/` — клієнти
- `/api/orders/` — замовлення
- `/api/users/` — користувачі
- `/login/`, `/logout/` — Knox токени

### Frontend (Angular)

- Standalone компоненти
- NgRx: actions, reducers, effects, selectors
- Angular Material (адаптивний UI)
- Аутентифікація з токенами

---

## 🛠️ Розгортання

### Для розробки

**Backend**

```bash
git clone https://github.com/tpforegoing/shoping.git
cd shoping/backend
python -m venv env
source env/bin/activate  # або env\Scripts\activate
pip install -r requirements.txt
cp .env.example .env     # створіть .env з DEBUG=True
python manage.py migrate
python manage.py runserver
```

**Frontend**

```bash
cd ../frontend
npm install
ng serve
```

### Для продакшену

- Django: через Gunicorn + .env з PostgreSQL
- Angular: `ng build --configuration production`
- Nginx: reverse proxy для API, /static та frontend
- HTTPS: Let's Encrypt

Деталі: див. [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 🔐 Ролі та дозволи

| Роль    | Можливості                                |
| ------- | ----------------------------------------- |
| CLIENT  | Бачить продукти з цінами, свої замовлення |
| MANAGER | Повний доступ до усіх CRUD операцій       |

---

## 📚 API документація

Документація доступна в [API\_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

## 🪡 Архітектура

- **Backend**: моделі базуються на абстрактному `Thing`
- **Frontend**: модульна структура, NgRx, standalone компоненти
- **Денормалізація**: `current_price`, `full_title` тощо
- **Сигнали**: автоматичне оновлення залежних полів

Докладніше:

- [BACKEND\_ARCHITECTURE.md](BACKEND_ARCHITECTURE.md)
- [FRONTEND\_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md)
- [PROJECT\_OVERVIEW.md](PROJECT_OVERVIEW.md)

---

## 📄 Ліцензія

Проєкт використовує MIT License (опційно: додайте LICENSE.md).

---

## ✨ Автор

[tpforegoing](https://github.com/tpforegoing)

