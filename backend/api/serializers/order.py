from rest_framework import serializers                  #type: ignore      
from rest_framework.exceptions import ValidationError   #type: ignore

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
        fields = ['id', 'customer', 'status', 'total_price' ,'created', 'updated', 'updated_by']
        read_only_fields = ['total_price', 'created', 'updated', 'updated_by']


class OrderWithItemsSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    items = OrderItemSerializer(source='items.all', many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'status', 'total_price', 'created', 'updated', 'items']
        read_only_fields = ['total_price', 'created', 'updated']


class OrderWithItemsCreateSerializer(serializers.ModelSerializer):
    items = OrderItemEditSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'status', 'items']  

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        order = Order.objects.create(**validated_data)

        for item_data in items_data:
            product = item_data['product']
            price = product.current_price_value
            if not price:
                raise ValidationError(f'Продукт {product.title} не має актуальної ціни.')

            OrderItem.objects.create(
                order=order,
                price_at_time=price,
                created_by=self.context['request'].user,
                updated_by=self.context['request'].user,
                **item_data
            )
        return order
