### ✅ POST /api/products/
POST /api/products/
Authorization: Token <your_token>
Content-Type: application/json

{
  "title": "Товар 1",
  "description": "Опис товару",
  "category": 2
}

---
### ✅ Response 201
{
  "id": 104,
  "title": "Товар 1",
  "description": "Опис товару",
  "category": 2,
  "created": "2025-04-22T22:00:00Z",
  "updated": "2025-04-22T22:00:00Z",
  "created_by": 1,
  "updated_by": 1
}

### ✏️ PUT /api/products/104/
PUT /api/products/104/
Authorization: Token <your_token>
Content-Type: application/json

{
  "title": "Товар 1 - оновлений",
  "description": "Новий опис",
  "category": 2
}

---
### ✅ Response 200
{
  "id": 104,
  "title": "Товар 1 - оновлений",
  "description": "Новий опис",
  "category": 2,
  "created": "2025-04-22T22:00:00Z",
  "updated": "2025-04-22T22:10:00Z",
  "created_by": 1,
  "updated_by": 1
}

### 🗑 DELETE /api/products/104/
DELETE /api/products/104/
Authorization: Token <your_token>

---
### ✅ Response 204
(No Content)

---
### 🔐 Role-based behavior:
- Client:
  - може бачити тільки товари з ціною (Product.objects.filter(price__isnull=False))
  - не може створювати/редагувати/видаляти
  - отримує ProductPublicSerializer

- Manager:
  - має повний доступ (CRUD)
  - отримує ProductAdminSerializer
