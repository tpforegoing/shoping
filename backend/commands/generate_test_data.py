from django.utils import timezone                       # type: ignore

from api.models.users import CustomUser
from api.models.customer import Customer
from api.models.product import Product, ProductCategory, Price
from api.models.order import Order, OrderItem

import random
from datetime import timedelta

material_icons = [
    "restaurant", "fastfood","emoji_food_beverage", "bakery_dining", "icecream", "liquor",
    "local_grocery_store", "nutrition", "set_meal", "redeem", "shopping_bag", "egg_alt",
    "ramen_dining", "lunch_dining", "brunch_dining", "dinner_dining", "coffee", "takeout_dining",
    "food_bank", "wine_bar"
]

# 🔹 Створення користувачів і клієнтів
for i in range(5):
    print(f"Create user{i}")
    user = CustomUser.objects.create_user(username=f'user{i}', password='pass1234', role='client')
    Customer.objects.create(user=user, code=f'CUST{i:03}', name=f'Клієнт {i}', phone_no=f'+38050123{i:03}')

# 🔹 Категорії з вкладеністю
root_categories = []
for i in range(20):
    print(f"Категорія {i}")
    root = ProductCategory.objects.create(code=f'cat{i}', title=f'Категорія {i}')
    root_categories.append(root)
    for j in range(2):  # підкатегорії
        ProductCategory.objects.create(
            code=f'cat{i}_{j}',
            title=f'Підкатегорія {i}-{j}',
            parent=root,
            icon=random.choice(material_icons)
        )

# 🔹 Продукти
all_categories = ProductCategory.objects.all()
products = []
for i in range(100):
    print(f"Товар {i}")
    product = Product.objects.create(
        title=f'Товар {i}',
        category=random.choice(all_categories)
    )
    Price.objects.create(
        product=product,
        value=random.randint(1000, 5000),
        valid_from=timezone.now() - timedelta(days=random.randint(1, 20)),
        is_active=True
    )
    products.append(product)

# 🔹 Замовлення з різними статусами
customers = Customer.objects.all()
status_list = ['draft', 'submitted', 'paid', 'cancelled']

for customer in customers:
    print(f"Замовлення для {customer}")
    for status in status_list:
        order = Order.objects.create(customer=customer, status=status)
        selected_products = random.sample(products, k=3)
        for product in selected_products:
            price = product.current_price
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=random.randint(1, 3),
                price_at_time=price.value
            )
