from django.contrib import admin                    #type: ignore
from api.models.product import Product, Price, ProductCategory


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'description')
    search_fields = ('title', 'category__title', 'description')


@admin.register(Price)
class PriceAdmin(admin.ModelAdmin):
    list_display = ('product', 'value', 'valid_from', 'valid_to', 'is_active', 'description')
    list_filter = ('is_active', 'product')
    search_fields = ('product__title', 'description')

@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'full_title', 'parent', 'code')
    search_fields = ('title', 'code')