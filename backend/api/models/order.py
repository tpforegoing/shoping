from django.db import models                            # type: ignore

from api.models.customer import Customer
from api.models.product import Product
from api.models.models_thing import Thing
   
# 📑 Order
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
    def __str__(self):
        return f"Order #{self.id} ({self.customer.user.username})"

    @property
    def total_price(self):
        return sum(item.total_price for item in self.items.all())

# 🧾 OrderItem
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
