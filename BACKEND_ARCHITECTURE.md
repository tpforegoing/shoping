# Архітектура бекенду (Django)

## Технологічний стек

- **Django 5.2**: Основний фреймворк
- **Django REST Framework**: Для створення RESTful API
- **Knox**: Для токен-автентифікації
- **django-environ**: Для управління змінними середовища
- **SQLite/PostgreSQL**: Бази даних для розробки/продакшену

## Структура проекту

```
backend/
├── api/                    # Основний додаток
│   ├── admin/              # Конфігурація адмін-панелі
│   ├── management/         # Кастомні команди Django
│   │   └── commands/       # Команди для управління даними
│   ├── migrations/         # Міграції бази даних
│   ├── models/             # Моделі даних
│   │   ├── __init__.py
│   │   ├── customer.py     # Модель клієнта
│   │   ├── models_thing.py # Базова абстрактна модель
│   │   ├── order.py        # Моделі замовлень
│   │   ├── product.py      # Моделі продуктів
│   │   ├── roles.py        # Константи ролей
│   │   └── users.py        # Модель користувача
│   ├── serializers/        # Серіалізатори для API
│   ├── services/           # Бізнес-логіка
│   ├── views_api/          # API views
│   ├── urls.py             # URL маршрути API
│   └── views.py            # Базові views
├── commands/               # Кастомні команди Django
├── shoping/                # Конфігурація проекту
│   ├── settings/           # Налаштування
│   │   ├── base.py         # Базові налаштування
│   │   ├── dev.py          # Налаштування для розробки
│   │   └── prod.py         # Налаштування для продакшену
│   ├── urls.py             # Головні URL маршрути
│   └── wsgi.py             # WSGI конфігурація
└── manage.py               # Скрипт управління Django
```

## Архітектура бази даних

### Базова модель

Всі основні моделі успадковуються від абстрактної моделі `Thing`, яка надає спільні поля:

```python
class Thing(models.Model):
    title = models.CharField(max_length=255, default="")
    description = models.CharField(max_length=255, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="created_by_%(app_label)s_%(class)s_related",
        null=True)
    updated = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="updated_by_%(app_label)s_%(class)s_related",
        null=True)

    class Meta:
        abstract = True
```

### Основні моделі

#### Користувачі та ролі

```python
# Константи ролей
CLIENT = 'client'
MANAGER = 'manager'

ROLE_CHOICES = [
    (CLIENT, 'Client'),
    (MANAGER, 'Manager'),
]

# Модель користувача
class CustomUser(AbstractUser):
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=CLIENT)

    def is_client(self):
        return self.role == CLIENT

    def is_manager(self):
        return self.role == MANAGER
```

#### Клієнти

```python
class Customer(Thing):
    title = None
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    code = models.CharField(max_length=12, unique=True)
    name = models.CharField(max_length=150)
    phone_no = models.CharField(max_length=30, blank=True)
```

#### Продукти та категорії

```python
class ProductCategory(Thing):
    code = models.SlugField(max_length=50, unique=True)
    icon = models.CharField(max_length=100, blank=True, null=True, default=None)
    title = models.CharField(max_length=100)
    parent = models.ForeignKey('self',
                               on_delete=models.SET_NULL,
                               related_name='children',
                               blank=True, null=True,
                               verbose_name='Parent Category')
    full_title = models.CharField(max_length=500, blank=True, db_index=True)

    def __str__(self):
        return self.full_title

class Product(Thing):
    category = models.ForeignKey(ProductCategory,
                                 on_delete=models.SET_NULL,
                                 null=True, blank=True,
                                 related_name='products')
    current_price_value = models.DecimalField(max_digits=10, decimal_places=2,
                                             null=True, blank=True, db_index=True)
    current_price_id = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return self.title

class Price(Thing):
    title = None
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='prices')
    value = models.DecimalField(max_digits=10, decimal_places=2)
    valid_from = models.DateTimeField(db_index=True)
    valid_to = models.DateTimeField(null=True, blank=True, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    description = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['-valid_from']
        indexes = [
            models.Index(fields=['product', 'is_active', 'valid_from'],
                         name='price_validity_idx')
        ]

    def __str__(self):
        return f"💰{self.value} грн [📦]{self.product.title}) з {self.valid_from:%d.%m.%Y}"

    def is_valid_now(self):
        now = timezone.now()
        return (
            self.is_active and
            self.valid_from <= now and
            (self.valid_to is None or self.valid_to >= now)
        )
```

#### Замовлення

```python
class Order(Thing):
    STATUS_CHOICES = [
        ('draft', 'Чернетка'),
        ('submitted', 'Очікує оплату'),
        ('paid', 'Оплачено'),
        ('cancelled', 'Скасовано'),
    ]
    title = None
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    products = models.ManyToManyField(Product, through='OrderItem')

    @property
    def total_price(self):
        return sum(item.total_price for item in self.items.all())

class OrderItem(Thing):
    title = None
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price_at_time = models.DecimalField(max_digits=10, decimal_places=2)

    @property
    def total_price(self):
        return self.price_at_time * self.quantity

    def __str__(self):
        return f"[{self.product.title}]: {self.quantity} x {self.price_at_time} = {self.total_price} грн"
```

## API архітектура

### Базовий ViewSet

Проект використовує базовий клас `GenericThingViewSet`, який надає спільну функціональність для всіх API ендпоінтів:

```python
class GenericThingViewSet(ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    permission_classes_map = {}
    filter_backends = [SearchFilter, OrderingFilter]
    pagination_class = DefaultPagination

    model = None
    serializer_class = None
    serializer_map = {}
    search_fields = []
    ordering_fields = '__all__'
```

### Основні API ендпоінти

```python
router = DefaultRouter()
router.register(r'category', ProductCategoryViewSet, basename='category')
router.register(r'price', PriceViewSet, basename='price')
router.register(r'customer', CustomerViewSet, basename='customer')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'users', UserViewSet, basename='user')

# Додаткові URL маршрути
urlpatterns = [
    path('', include(router.urls)),
    path('orders/<int:order_id>/items/', order_item_list, name='orderitem-list'),
    path('orders/<int:order_id>/items/<int:pk>/', order_item_detail, name='orderitem-detail'),
    # 📦 Продукти
    path('products/', ProductViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('products/<int:pk>/', ProductViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
    # 📦💰 Ціни конкретного продукту
    path('products/<int:product_id>/prices/', ProductPriceViewSet.as_view({'get': 'list'})),
]
```

## Система дозволів

Проект використовує систему дозволів на основі ролей:

```python
# Базові ролі
CLIENT = 'client'
MANAGER = 'manager'

# Кастомні класи дозволів
class IsManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == MANAGER

class IsOwnerOrManager(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == MANAGER:
            return True
        # Перевірка власника (залежить від моделі)
        return obj.customer.user == request.user
```

## Аутентифікація

Проект використовує Knox для токен-автентифікації:

```python
REST_KNOX = {
  'SECURE_HASH_ALGORITHM': 'hashlib.sha512',
  'AUTH_TOKEN_CHARACTER_LENGTH': 64,
  'TOKEN_TTL': timedelta(hours=4),
  'AUTH_HEADER_PREFIX': 'Token',
  'USER_SERIALIZER': 'api.serializers.CustomUserSerializer',
  'AUTO_REFRESH': True,
  'MIN_REFRESH_INTERVAL': 60,
}
```

## Налаштування середовища

Проект використовує django-environ для управління змінними середовища:

```python
env = environ.Env(
    DEBUG=(bool, False)
)
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("SECRET_KEY")
DEBUG = env("DEBUG")
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")
DATABASES = {
    'default': env.db(),  # автоматично зчитує DATABASE_URL
}
```

## Денормалізація даних та сигнали

Для оптимізації запитів використовується денормалізація даних:

### Денормалізовані поля в моделі Product

```python
class Product(Thing):
    # ...
    current_price_value = models.DecimalField(max_digits=10, decimal_places=2,
                                             null=True, blank=True, db_index=True)
    current_price_id = models.PositiveIntegerField(null=True, blank=True)
```

### Сигнали для автоматичного оновлення денормалізованих полів

```python
# Сигнал для оновлення full_title категорії
@receiver(pre_save, sender=ProductCategory)
def update_category_full_title(sender, instance, **kwargs):
    """Оновлює full_title перед збереженням категорії"""
    if instance.parent:
        try:
            parent = ProductCategory.objects.get(pk=instance.parent.pk)
            instance.full_title = f"{parent.full_title}. {instance.title}"
        except ProductCategory.DoesNotExist:
            instance.full_title = instance.title
    else:
        instance.full_title = instance.title

# Сигнал для оновлення current_price_value та current_price_id
@receiver(post_save, sender=Price)
def update_product_current_price(sender, instance, created, **kwargs):
    """Оновлює current_price_value та current_price_id продукту при збереженні ціни"""
    product = instance.product
    now = timezone.now()

    # Знаходимо поточну дійсну ціну
    current_price = Price.objects.filter(
        product=product,
        is_active=True,
        valid_from__lte=now
    ).filter(
        models.Q(valid_to__gte=now) | models.Q(valid_to__isnull=True)
    ).order_by('-valid_from').first()

    if current_price:
        # Оновлюємо продукт з інформацією про поточну ціну
        Product.objects.filter(pk=product.pk).update(
            current_price_value=current_price.value,
            current_price_id=current_price.id
        )
    else:
        # Дійсна ціна не знайдена
        Product.objects.filter(pk=product.pk).update(
            current_price_value=None,
            current_price_id=None
        )
```

### Команда для масового оновлення денормалізованих полів

```python
class Command(BaseCommand):
    help = 'Масове оновлення денормалізованих полів для продуктів'

    def add_arguments(self, parser):
        parser.add_argument(
            '--batch-size',
            type=int,
            default=1000,
            help='Кількість записів для обробки в кожній партії'
        )
        parser.add_argument(
            '--sleep',
            type=float,
            default=0.1,
            help='Час сну між партіями (секунди)'
        )

    def handle(self, *args, **options):
        batch_size = options['batch_size']
        sleep_time = options['sleep']

        self.stdout.write('Оновлення current_price для продуктів...')
        self.update_products_current_price(batch_size, sleep_time)
```

## Рекомендації з розробки

1. **Моделі**: Всі нові моделі повинні успадковуватись від `Thing`
2. **API Views**: Використовуйте `GenericThingViewSet` для нових ендпоінтів
3. **Дозволи**: Використовуйте `permission_classes_map` для налаштування дозволів на рівні дій
4. **Серіалізатори**: Використовуйте `serializer_map` для різних серіалізаторів на різних ендпоінтах
5. **Фільтрація**: Використовуйте `filterset_fields` та `search_fields` для налаштування фільтрації
6. **Денормалізація**: Використовуйте денормалізовані поля для оптимізації запитів
7. **Сигнали**: Використовуйте сигнали для автоматичного оновлення денормалізованих полів
