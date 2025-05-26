# API Документація

## Базові URL

```
/login/ - Вхід в систему (Knox токен-автентифікація)
/logout/ - Вихід з системи
/logout-all/ - Вихід з усіх сесій
/api/ - Базовий URL для всіх API ендпоінтів
```

## Автентифікація

- **POST /login/** - Вхід в систему, повертає Knox токен
  - Запит: `{ "username": "user", "password": "pass" }`
  - Відповідь: `{ "token": "...", "user": {...} }`
- **POST /logout/** - Вихід з поточної сесії
- **POST /logout-all/** - Вихід з усіх сесій користувача

Всі запити до API (крім логіну) повинні містити заголовок:
```
Authorization: Token <your_token>
```

## Продукти

### Список продуктів
- **GET /api/products/**
  - Для клієнтів: продукти з цінами
  - Для менеджерів: всі продукти
  - Параметри:
    - `?search=someword` - пошук по назві, опису та категорії
    - `?category=3` - фільтрація по категорії
    - `?min_price=100` - фільтрація за мінімальною ціною
    - `?max_price=500` - фільтрація за максимальною ціною
    - `?page=2` - пагінація
  - Відповідь:
    ```json
    {
      "count": 100,
      "next": "http://api.example.org/api/products/?page=2",
      "previous": null,
      "results": [
        {
          "id": 1,
          "title": "Продукт 1",
          "description": "Опис продукту",
          "category": {
            "id": 3,
            "code": "category-3",
            "icon": "restaurant",
            "title": "Категорія 3",
            "full_title": "Категорія 3"
          },
          "current_price_value": "150.00",
          "current_price_id": 5,
          "current_price": {
            "id": 5,
            "product_id": 1,
            "product": "Продукт 1",
            "value": "150.00",
            "valid_from": "2023-10-15T14:30:00Z",
            "valid_to": null,
            "is_active": true,
            "description": ""
          }
        },
        ...
      ]
    }
    ```

### Деталі продукту
- **GET /api/products/{id}/**
  - Відповідь:
    ```json
    {
      "id": 1,
      "title": "Продукт 1",
      "description": "Опис продукту",
      "category": {
        "id": 3,
        "code": "category-3",
        "icon": "restaurant",
        "title": "Категорія 3",
        "full_title": "Категорія 3"
      },
      "current_price_value": "150.00",
      "current_price_id": 5,
      "current_price": {
        "id": 5,
        "product_id": 1,
        "product": "Продукт 1",
        "value": "150.00",
        "valid_from": "2023-10-15T14:30:00Z",
        "valid_to": null,
        "is_active": true,
        "description": ""
      },
      "created": "2023-10-15T14:30:00Z",
      "updated": "2023-10-15T14:30:00Z",
      "created_by": "admin",
      "updated_by": "admin"
    }
    ```

### Створення продукту
- **POST /api/products/** (тільки менеджери)
  - Запит:
    ```json
    {
      "title": "Новий продукт",
      "description": "Опис нового продукту",
      "category": 3
    }
    ```
  - Відповідь:
    ```json
    {
      "id": 104,
      "title": "Новий продукт",
      "description": "Опис нового продукту",
      "category": {
        "id": 3,
        "code": "category-3",
        "icon": "restaurant",
        "title": "Категорія 3",
        "full_title": "Категорія 3"
      },
      "current_price_value": null,
      "current_price_id": null,
      "created": "2023-10-15T14:30:00Z",
      "updated": "2023-10-15T14:30:00Z",
      "created_by": "admin",
      "updated_by": "admin"
    }
    ```

### Оновлення продукту
- **PUT/PATCH /api/products/{id}/** (тільки менеджери)
  - Запит:
    ```json
    {
      "title": "Оновлена назва",
      "description": "Оновлений опис",
      "category": 3
    }
    ```
  - Відповідь:
    ```json
    {
      "id": 104,
      "title": "Оновлена назва",
      "description": "Оновлений опис",
      "category": {
        "id": 3,
        "code": "category-3",
        "icon": "restaurant",
        "title": "Категорія 3",
        "full_title": "Категорія 3"
      },
      "current_price_value": null,
      "current_price_id": null,
      "created": "2023-10-15T14:30:00Z",
      "updated": "2023-10-15T14:40:00Z",
      "created_by": "admin",
      "updated_by": "admin"
    }
    ```

### Видалення продукту
- **DELETE /api/products/{id}/** (тільки менеджери)

### Ціни продукту
- **GET /api/products/{product_id}/prices/**
  - Список цін для конкретного продукту
  - Параметри:
    - `?search=someword` - пошук по опису
    - `?is_active=true` - фільтрація за активністю
    - `?page=2` - пагінація
  - Відповідь:
    ```json
    {
      "count": 5,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": 1,
          "product_id": 5,
          "product": "Продукт 5",
          "value": "150.00",
          "valid_from": "2023-10-15T14:30:00Z",
          "valid_to": null,
          "is_active": true,
          "description": "Базова ціна"
        },
        ...
      ]
    }
    ```

## Категорії продуктів

### Список категорій
- **GET /api/category/**
  - Параметри:
    - `?search=someword` - пошук по назві, коду та опису
    - `?parent=3` - фільтрація за батьківською категорією
    - `?page=2` - пагінація
  - Відповідь:
    ```json
    {
      "count": 10,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": 1,
          "code": "category-1",
          "icon": "restaurant",
          "title": "Категорія 1",
          "full_title": "Категорія 1",
          "description": "Опис категорії",
          "parent": null
        },
        {
          "id": 2,
          "code": "subcategory-1",
          "icon": "fastfood",
          "title": "Підкатегорія 1",
          "full_title": "Категорія 1. Підкатегорія 1",
          "description": "Опис підкатегорії",
          "parent": 1
        },
        ...
      ]
    }
    ```

### Деталі категорії
- **GET /api/category/{id}/**
  - Відповідь:
    ```json
    {
      "id": 2,
      "code": "subcategory-1",
      "icon": "fastfood",
      "title": "Підкатегорія 1",
      "full_title": "Категорія 1. Підкатегорія 1",
      "description": "Опис підкатегорії",
      "parent": 1,
      "created": "2023-10-15T14:30:00Z",
      "updated": "2023-10-15T14:30:00Z",
      "created_by": "admin",
      "updated_by": "admin"
    }
    ```

### Створення категорії
- **POST /api/category/** (тільки менеджери)
  - Запит:
    ```json
    {
      "title": "Нова категорія",
      "code": "nova-kategoria",
      "icon": "fastfood",
      "description": "Опис нової категорії",
      "parent": 1
    }
    ```
  - Відповідь:
    ```json
    {
      "id": 11,
      "code": "nova-kategoria",
      "icon": "fastfood",
      "title": "Нова категорія",
      "full_title": "Категорія 1. Нова категорія",
      "description": "Опис нової категорії",
      "parent": 1,
      "created": "2023-10-15T14:30:00Z",
      "updated": "2023-10-15T14:30:00Z",
      "created_by": "admin",
      "updated_by": "admin"
    }
    ```

### Оновлення категорії
- **PUT/PATCH /api/category/{id}/** (тільки менеджери)

### Видалення категорії
- **DELETE /api/category/{id}/** (тільки менеджери)

## Ціни

### Список цін
- **GET /api/price/**
  - Параметри:
    - `?product=5` - фільтрація по продукту
    - `?search=someword` - пошук по опису
    - `?is_active=true` - фільтрація за активністю
    - `?page=2` - пагінація
  - Відповідь:
    ```json
    {
      "count": 50,
      "next": "http://api.example.org/api/price/?page=2",
      "previous": null,
      "results": [
        {
          "id": 1,
          "product_id": 5,
          "product": "Продукт 5",
          "value": "150.00",
          "valid_from": "2023-10-15T14:30:00Z",
          "valid_to": null,
          "is_active": true,
          "description": "Базова ціна",
          "created": "2023-10-15T14:30:00Z",
          "updated": "2023-10-15T14:30:00Z",
          "created_by": "admin",
          "updated_by": "admin"
        },
        ...
      ]
    }
    ```

### Деталі ціни
- **GET /api/price/{id}/**
  - Відповідь:
    ```json
    {
      "id": 1,
      "product_id": 5,
      "product": "Продукт 5",
      "value": "150.00",
      "valid_from": "2023-10-15T14:30:00Z",
      "valid_to": null,
      "is_active": true,
      "description": "Базова ціна"
    }
    ```

### Створення ціни
- **POST /api/price/** (тільки менеджери)
  - Запит:
    ```json
    {
      "product": 5,
      "value": 175.00,
      "valid_from": "2023-10-15T14:30:00Z",
      "valid_to": null,
      "is_active": true,
      "description": "Нова ціна",
      "deactivate_previous": true
    }
    ```
  - Відповідь:
    ```json
    {
      "id": 10,
      "product_id": 5,
      "product": "Продукт 5",
      "value": "175.00",
      "valid_from": "2023-10-15T14:30:00Z",
      "valid_to": null,
      "is_active": true,
      "description": "Нова ціна"
    }
    ```

### Оновлення ціни
- **PUT/PATCH /api/price/{id}/** (тільки менеджери)

### Видалення ціни
- **DELETE /api/price/{id}/** (тільки менеджери)

## Клієнти

### Список клієнтів
- **GET /api/customer/** (тільки менеджери бачать всіх)
  - Відповідь:
    ```json
    {
      "count": 20,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": 1,
          "user": 5,
          "name": "Іван Петренко",
          "phone": "+380991234567",
          "address": "вул. Шевченка, 10, кв. 5"
        },
        ...
      ]
    }
    ```

### Деталі клієнта
- **GET /api/customer/{id}/** (власник або менеджер)

### Створення клієнта
- **POST /api/customer/** (тільки менеджери)
  - Запит:
    ```json
    {
      "user": 5,
      "name": "Новий клієнт",
      "phone": "+380991234567",
      "address": "вул. Нова, 1, кв. 1"
    }
    ```

### Оновлення клієнта
- **PUT/PATCH /api/customer/{id}/** (власник або менеджер)

### Видалення клієнта
- **DELETE /api/customer/{id}/** (тільки менеджери)

## Замовлення

### Список замовлень
- **GET /api/orders/**
  - Для клієнтів: тільки власні замовлення
  - Для менеджерів: всі замовлення
  - Параметри:
    - `?status=pending` - фільтрація по статусу
    - `?customer=3` - фільтрація по клієнту (тільки для менеджерів)
  - Відповідь:
    ```json
    {
      "count": 30,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": 1,
          "customer": 3,
          "customer_name": "Іван Петренко",
          "status": "pending",
          "total": "450.00",
          "date_created": "2023-10-20T10:15:00Z",
          "items": [
            {
              "id": 1,
              "product": 5,
              "product_name": "Продукт 5",
              "price": "150.00",
              "quantity": 3,
              "subtotal": "450.00"
            }
          ]
        },
        ...
      ]
    }
    ```

### Деталі замовлення
- **GET /api/orders/{id}/** (власник або менеджер)

### Створення замовлення
- **POST /api/orders/**
  - Запит:
    ```json
    {
      "customer": 3,
      "status": "pending"
    }
    ```

### Оновлення замовлення
- **PUT/PATCH /api/orders/{id}/** (власник або менеджер)
  - Запит:
    ```json
    {
      "status": "completed"
    }
    ```

### Видалення замовлення
- **DELETE /api/orders/{id}/** (власник або менеджер)

## Елементи замовлення

### Список елементів замовлення
- **GET /api/orders/{order_id}/items/**
  - Відповідь:
    ```json
    [
      {
        "id": 1,
        "order": 5,
        "product": 3,
        "product_name": "Продукт 3",
        "price": "150.00",
        "quantity": 2,
        "subtotal": "300.00"
      },
      ...
    ]
    ```

### Додавання елемента до замовлення
- **POST /api/orders/{order_id}/items/**
  - Запит:
    ```json
    {
      "product": 3,
      "price": "150.00",
      "quantity": 2
    }
    ```

### Деталі елемента замовлення
- **GET /api/orders/{order_id}/items/{id}/**

### Оновлення елемента замовлення
- **PUT/PATCH /api/orders/{order_id}/items/{id}/**
  - Запит:
    ```json
    {
      "quantity": 3
    }
    ```

### Видалення елемента замовлення
- **DELETE /api/orders/{order_id}/items/{id}/**

## Користувачі

### Список користувачів
- **GET /api/users/** (тільки менеджери)
  - Відповідь:
    ```json
    {
      "count": 15,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": 1,
          "username": "user1",
          "email": "user1@example.com",
          "first_name": "Іван",
          "last_name": "Петренко",
          "role": "CLIENT"
        },
        ...
      ]
    }
    ```

### Деталі користувача
- **GET /api/users/{id}/** (власник або менеджер)

### Створення користувача
- **POST /api/users/** (тільки менеджери)
  - Запит:
    ```json
    {
      "username": "newuser",
      "email": "newuser@example.com",
      "password": "securepassword",
      "first_name": "Новий",
      "last_name": "Користувач",
      "role": "CLIENT"
    }
    ```

### Оновлення користувача
- **PUT/PATCH /api/users/{id}/** (власник або менеджер)

### Видалення користувача
- **DELETE /api/users/{id}/** (тільки менеджери)

## Система дозволів

API використовує систему дозволів на основі ролей:
- `CLIENT` - звичайні користувачі, які можуть бачити тільки свої дані
- `MANAGER` - адміністратори, які мають повний доступ до всіх ресурсів

## Пагінація

Всі списки підтримують пагінацію з параметром `?page=N`. За замовчуванням повертається 50 елементів на сторінку.

## Денормалізовані поля

Для оптимізації запитів використовуються денормалізовані поля:

- `Product.current_price_value` - поточна ціна продукту (значення)
- `Product.current_price_id` - ID поточної ціни продукту
- `ProductCategory.full_title` - повна назва категорії з урахуванням ієрархії

Ці поля автоматично оновлюються при зміні відповідних даних.

## Фільтрація

Більшість ендпоінтів підтримують фільтрацію з параметрами:
- `?search=query` - пошук по текстових полях
- `?ordering=field` або `?ordering=-field` - сортування (- для зворотнього порядку)
- `?is_active=true` - фільтрація за активністю (для цін)
- `?min_price=100` та `?max_price=500` - фільтрація за ціною (для продуктів)
- Специфічні фільтри для кожного ресурсу (наприклад, `?status=pending` для замовлень)

## Коди відповідей

- `200 OK` - Успішний запит
- `201 Created` - Ресурс успішно створено
- `204 No Content` - Ресурс успішно видалено
- `400 Bad Request` - Помилка у запиті
- `401 Unauthorized` - Необхідна автентифікація
- `403 Forbidden` - Доступ заборонено
- `404 Not Found` - Ресурс не знайдено
- `500 Internal Server Error` - Помилка сервера