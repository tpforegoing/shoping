from django.core.management.base import BaseCommand        #type: ignore
from django.utils import timezone                          #type: ignore 

from api.models.users import CustomUser
from api.models.customer import Customer
from api.models.product import Product, ProductCategory, Price
from api.models.order import Order, OrderItem
from api.models.roles import CLIENT, MANAGER  


import random
from datetime import timedelta

class Command(BaseCommand):
    help = "Генерує тестові дані: всі категорії/товари — від admin, а замовлення — для кожного клієнта з цих товарів."

    def handle(self, *args, **options):
        # Якщо суперкористувач вже є — не виконуємо seed (уникаємо дублів!)
        if CustomUser.objects.filter(username="admin").exists():
            print("Superuser 'admin' already exists, seed data NOT added.")
            return

        # 1. Створюємо суперкористувача
        admin = CustomUser.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="adminpass",
            role=MANAGER
        )
        print("Created superuser: admin")

        material_icons = [
            "restaurant", "fastfood", "emoji_food_beverage", "bakery_dining", "icecream", "liquor",
            "local_grocery_store", "nutrition", "set_meal", "redeem", "shopping_bag", "egg_alt",
            "ramen_dining", "lunch_dining", "brunch_dining", "dinner_dining", "coffee", "takeout_dining",
            "food_bank", "wine_bar"
        ]

        # 2. Категорії (root + підкатегорії) — ОДИН раз
        root_categories = []
        for i in range(6):
            root = ProductCategory.objects.create(
                code=f'cat{i}',
                title=f'Категорія {i}',
                created_by=admin,
                updated_by=admin,
            )
            root_categories.append(root)
            for j in range(2):  # по 2 підкатегорії на кожну root
                ProductCategory.objects.create(
                    code=f'cat{i}_{j}',
                    title=f'Підкатегорія {i}-{j}',
                    parent=root,
                    icon=random.choice(material_icons),
                    created_by=admin,
                    updated_by=admin,
                )

        # 3. Продукти + ціни (усі — просто як від системи)
        all_categories = ProductCategory.objects.all()
        products = []
        for i in range(30):
            product = Product.objects.create(
                title=f'Товар {i}',
                category=random.choice(all_categories),
                created_by=admin,
                updated_by=admin,
            )
            Price.objects.create(
                product=product,
                value=random.randint(1000, 5000),
                valid_from=timezone.now() - timedelta(days=random.randint(1, 20)),
                is_active=True,
                created_by=admin,
                updated_by=admin,
            )
            products.append(product)

        # 4. Створити 5 клієнтів-користувачів (або скільки треба)
        customers = []
        for i in range(5):
            user = CustomUser.objects.create_user(
                username=f'user{i}',
                password='pass1234',
                role=CLIENT
            )
            customer = Customer.objects.create(
                user=user,
                code=f'CUST{i:03}',
                name=f'Клієнт {i}',
                phone_no=f'+38050123{i:03}'
            )
            customers.append(customer)

        # 5. Для кожного клієнта створити замовлення з довільними продуктами із загального пулу
#        status_list = ['draft', 'submitted', 'paid', 'cancelled']
#        for customer in customers:
#            print(f"Замовлення для {customer}")
#            for status in status_list:
#                order = Order.objects.create(customer=customer, status=status, created_by=user, updated_by=user)
#                selected_products = random.sample(products, k=3)
#                for product in selected_products:
#                    price = product.current_price_value
#                    OrderItem.objects.create(
#                        order=order,
#                        product=product,
#                        quantity=random.randint(1, 10),
#                        price_at_time=price,
#                        created_by=user,
#                        updated_by=user,
#                    )

        print("Test data generated successfully.")
