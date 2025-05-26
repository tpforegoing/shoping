from rest_framework import serializers        #type: ignore
from api.models.roles import CLIENT, MANAGER
from api.models import Product, Price, ProductCategory
from api.services.pricing import get_applicable_price
from api.serializers.serializers_thing import ThingSerializer

class ProductCategoryBaseSerializer(serializers.ModelSerializer):
    full_title = serializers.CharField(read_only=True)
    class Meta:
        model = ProductCategory
        fields = '__all__'
        read_only_fields = ['created', 'updated', 'created_by', 'updated_by']

class ProductCategorySerializer(serializers.ModelSerializer):
    # parent = ProductCategoryBaseSerializer(read_only=True)
    full_title = serializers.CharField(read_only=True)  
    class Meta:
        model = ProductCategory
        fields = '__all__'
        read_only_fields = ['created', 'updated', 'created_by', 'updated_by']

class ProductCategoryClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        exclude = ['created', 'updated', 'created_by', 'updated_by']

##############################################################################
# 💰 Серіалізатори для цін
##############################################################################
class PriceSerializer(ThingSerializer):
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    product = serializers.CharField(read_only=True)  
    class Meta:
        model = Price
        fields = ['id','product_id', 'product', 'value', 'valid_from', 
                  'valid_to', 'is_active', 'description']
        # read_only_fields = ['created', 'updated', 'created_by', 'updated_by']

class PriceClientSerializer(ThingSerializer):
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    product = serializers.CharField(read_only=True)  
    class Meta:
        model = Price  # Додаємо явне визначення моделі
        fields = ['id','product_id', 'product', 'value', 'valid_from', 
                  'valid_to', 'is_active', 'description']

class PriceListSerializer(ThingSerializer):
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    product = serializers.CharField(read_only=True)  
    class Meta:
        model = Price
        fields = ['id','product_id', 'product', 'value', 'valid_from', 
                  'valid_to', 'is_active', 'description',
                  'created', 'updated', 'created_by', 'updated_by']
        read_only_fields = ['created', 'updated', 'created_by', 'updated_by']

class PriceCreateUpdateSerializer(ThingSerializer):
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        allow_null=False,
        required=True
    )
    
    class Meta:
        model = Price
        fields = ['id', 'product', 'value', 'valid_from', 
                  'valid_to', 'is_active', 'description']

##############################################################################
# 📦 Серіалізатори для продуктів
##############################################################################
class ProductBaseSerializer(ThingSerializer):
    category = ProductCategorySerializer(read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'title', 'category', 'current_price_value', 'current_price_id',
                  'description', 'created', 'updated', 'created_by', 'updated_by']
        read_only_fields = ['created', 'updated', 'created_by', 'updated_by']

class ProductClientSerializer(ProductBaseSerializer):
    category = ProductCategoryClientSerializer(read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'title', 'category', 
                  'current_price_value', 'current_price_id',
                  'description']

class ProductManagerSerializer(ProductBaseSerializer):
    pass

class ProductManagerDetailSerializer(ThingSerializer):
    current_price = serializers.SerializerMethodField()
    category = ProductCategorySerializer(read_only=True)
    class Meta:
        model = Product
        fields = ['id', 'title', 'category', 
                  'current_price','current_price_value', 'current_price_id', 'description',
                  'created', 'updated', 'created_by', 'updated_by']
        read_only_fields = ['created', 'updated', 'created_by', 'updated_by']

    def get_current_price(self, obj):
        if obj.current_price_id:
            try:
                price = Price.objects.get(id=obj.current_price_id)
                return PriceSerializer(price).data
            except Price.DoesNotExist:
                return None
        return None

class ProductCreateUpdateSerializer(ThingSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=ProductCategory.objects.all(),
        allow_null=True,
        required=False
    )
    
    class Meta:
        model = Product
        fields = ['id', 'title', 'category', 'description']

class ProductWithPriceSerializer(ThingSerializer):
    current_price = serializers.SerializerMethodField()
    category = ProductCategorySerializer(read_only=True)
    # category = serializers.CharField(read_only=True)   

    class Meta:
        model = Product
        fields = ['id', 'title', 'category', 
                  'current_price','current_price_value', 'current_price_id', 'description']
        read_only_fields = ['created', 'updated', 'created_by', 'updated_by']

    def get_current_price(self, obj):
        if obj.current_price_id:
            try:
                price = Price.objects.get(id=obj.current_price_id)
                return PriceSerializer(price).data
            except Price.DoesNotExist:
                return None
        return None



