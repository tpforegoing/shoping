from django.db import transaction                               #type: ignore
from django.core.exceptions import ValidationError              #type: ignore

from api.models.order import Order, OrderItem
from api.models.product import Product
from api.services.pricing import get_applicable_price


class OrderService:

    @staticmethod
    @transaction.atomic
    def create_order(customer, items_data: list[dict]) -> Order:
        """
        Створює замовлення з товарами.
        items_data = [{'product_id': 1, 'quantity': 2}, ...]
        """
        order = Order.objects.create(customer=customer)

        for item in items_data:
            product = Product.objects.get(id=item['product_id'])
            price = get_applicable_price(product)

            if not price:
                raise ValidationError({
                    'product': product.title,
                    'message': f"❌ Немає активної ціни для '{product.title}'"
                })

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item['quantity'],
                price_value=price.value  # 🔐 просто зберігаємо значення
            )

        return order
