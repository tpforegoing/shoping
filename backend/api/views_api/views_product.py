from django.db.models import OuterRef, Subquery, DecimalField   #type: ignore
from django.db.models.functions import Coalesce                 #type: ignore

from rest_framework.viewsets import ReadOnlyModelViewSet         #type: ignore
from rest_framework.permissions import IsAuthenticated           #type: ignore
from rest_framework.response import Response                      #type: ignore
from rest_framework import filters                                #type: ignore
from rest_framework import status                               #type: ignore

from api.models.roles import CLIENT, MANAGER
from api.models.product import Product, Price, ProductCategory
from api.services.permissions import IsManager, is_client
from api.views_api.views_thing import GenericThingViewSet
from api.serializers.product import *
from .mixins import QueryFilterMixin


class ProductCategoryViewSet(GenericThingViewSet):
    """
    ViewSet для категорій:
    - Клієнт може лише переглядати список і деталі (без технічних полів);
    - Менеджер має повний доступ;
    - Підтримка фільтрації та пошуку.
    """
    model = ProductCategory
    serializer_class = ProductCategorySerializer
    serializer_map = {
        # 'list': ProductCategorySerializer,
        # 'retrieve': ProductCategoryClientSerializer,
        'create': ProductCategorySerializer,
        'update': ProductCategorySerializer,
        'partial_update': ProductCategorySerializer,
        'destroy': ProductCategorySerializer,

    }
    permission_classes_map = {
        'list': [IsAuthenticated],
        'retrieve': [IsAuthenticated],
        'create': [IsManager],
        'update': [IsManager],
        'partial_update': [IsManager],
        'destroy': [IsManager],
    }
    filter_backends = [filters.SearchFilter, filters.OrderingFilter] 
    filterset_fields = ['parent']
    search_fields = ['title','code', 'parent__title', 'description']
    ordering_fields= ['title', 'code', 'parent__title']
    ordering = ['title']
    
    def get_serializer_class(self):
        user = self.request.user
        if self.action in ['list', 'retrieve'] and is_client(user):
            return ProductCategoryClientSerializer
        return super().get_serializer_class()

class PriceViewSet(QueryFilterMixin, GenericThingViewSet):
    """
    ViewSet для управління цінами:
    - Доступний тільки для менеджерів
    - Підтримує фільтрацію за датами дії, активністю та продуктом
    - Підтримує пошук та сортування
    """
    permission_classes = [IsAuthenticated]
    model = Price
    serializer_class = PriceSerializer
    serializer_map = {
        'list': PriceListSerializer, 
        'retrieve': PriceClientSerializer,
        'create': PriceCreateUpdateSerializer,
        'update': PriceCreateUpdateSerializer,
        'partial_update': PriceSerializer,
    }
    permission_classes_map = {
        'list': [IsManager],
        'retrieve': [IsManager],
        'create': [IsManager],
        'update': [IsManager],
        'partial_update': [IsManager],
        'destroy': [IsManager],
    }
    filter_backends = [filters.SearchFilter, filters.OrderingFilter] 
    filterset_fields = ['valid_from', 'valid_to', 'is_active', 'product']
    search_fields = ['product__title', 'description','value']
    ordering_fields = ['valid_to', 'valid_from', 'value', 'is_active']
    ordering = ['-valid_to']
    
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return self.apply_filters(queryset)

class ProductViewSet(GenericThingViewSet):
    """
    ViewSet для управління продуктами:
    - Клієнти бачать тільки продукти з активними цінами
    - Менеджери мають повний доступ до всіх продуктів
    - Різні серіалізатори для різних ролей користувачів
    """

    model = Product
    serializer_class = ProductClientSerializer
    serializer_map = {
        'list': ProductManagerSerializer,
        'retrieve': ProductManagerDetailSerializer,
        'create': ProductCreateUpdateSerializer,
        'update': ProductCreateUpdateSerializer,
        'partial_update': ProductManagerSerializer,
        'destroy': ProductManagerSerializer,
    }

    permission_classes = [IsAuthenticated]
    permission_classes_map = {
        'list': [IsAuthenticated],
        'retrieve': [IsAuthenticated],
        'create': [IsManager],
        'update': [IsManager],
        'partial_update': [IsManager],
        'destroy': [IsManager],
    }
    filter_backends = [filters.SearchFilter, filters.OrderingFilter] 
    search_fields = ['title', 'category__title', 'category__full_title', 'description', 'current_price_value']
    ordering_fields = ['title', 'category__title', 'current_price_value']
    ordering = ['current_price_value','title']
    filterset_fields = ['category']


    def get_serializer_class(self):
        user = self.request.user
        if self.action in ['retrieve'] and is_client(user):
            return ProductClientSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        qs = super().get_queryset().select_related('category')
        user = self.request.user
        
        # Додаємо фільтрацію за ціною
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if min_price:
            qs = qs.filter(current_price_value__gte=min_price)
        
        if max_price:
            qs = qs.filter(current_price_value__lte=max_price)
        
        if user.role == CLIENT:
            # Тільки продукти з активними цінами
            return qs.filter(current_price_value__isnull=False).distinct()
        return qs  # Менеджери бачать усе

class ProductPriceViewSet(QueryFilterMixin, ReadOnlyModelViewSet):
    """
    ViewSet тільки для читання, що надає доступ до цін конкретного продукту:
    - Підтримує фільтрацію, пошук та сортування цін
    - Повертає інформацію про продукт разом із пагінованим списком цін
    - Різні серіалізатори для клієнтів та менеджерів
    """
    permission_classes = [IsManager]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter] 
    filterset_fields = ['is_active']
    search_fields = ['description', 'valid_from', 'valid_to', 'value']
    ordering_fields = ['valid_from', 'valid_to', 'value']
    ordering = ['-valid_from']

    def list(self, request, *args, **kwargs):
        product_id = self.kwargs.get('product_id')
        try:
            product = Product.objects.select_related('category').get(pk=product_id)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        # Базовий queryset — всі ціни цього продукту
        base_qs = product.prices.all()
        # Спочатку кастомна фільтрація (QueryFilterMixin)
        filtered_qs = self.apply_filters(base_qs)    
        # print("filtered_qs:", filtered_qs)    
        # Потім DRF фільтрація: search, ordering
        prices_qs = self.filter_queryset(filtered_qs)
        # print("final_qs:", prices_qs)
        # Фільтруємо та пагінуємо ціни за допомогою міксину    

        page = self.paginate_queryset(prices_qs)
        if page is not None:
            prices_paginated = self.get_paginated_response(
                self.get_price_serializer(page, many=True).data
            ).data
        else:
            prices_serializer = self.get_price_serializer(prices_qs, many=True)
            prices_paginated = {
                "count": prices_qs.count(),
                "next": None,
                "previous": None,
                "results": prices_serializer.data
            }

        response_data = prices_paginated

        return Response(response_data)

    def get_price_serializer(self, *args, **kwargs):
        user = self.request.user
        serializer_class = PriceListSerializer if user.role == MANAGER else PriceListSerializer
        return serializer_class(*args, context=self.get_serializer_context(), **kwargs)
       