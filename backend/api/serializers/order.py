from rest_framework import serializers               #type: ignore      

from api.models.order import Order, OrderItem
from api.models.product import Product
from api.serializers.customer import CustomerSerializer
from api.serializers.product import ProductClientSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductClientSerializer(read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'quantity', 'price_at_time', 'total_price']
        read_only_fields = ['id', 'order', 'total_price']

class OrderItemEditSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'quantity', 'price_at_time', 'total_price']
        read_only_fields = ['id', 'order', 'price_at_time', 'total_price']


class OrderSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'status', 'total_price' ,'created', 'updated']

class OrderWithItemsSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    items = OrderItemSerializer(source='items.all', many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'status', 'total_price', 'items']