from django.contrib import admin                        #type: ignore
from api.models.order import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'status', 'created', 'total_price')
    inlines = [OrderItemInline]
    list_filter = ('customer',)

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        'order', 'product', 'quantity', 'price_at_time', 'total_price'
    )
    list_filter = ('product__title',)
