from django.urls import path, include                    # type: ignore   
from rest_framework.routers import DefaultRouter         # type: ignore

from api.views_api.views_user import UserViewSet
from api.views_api.views_customer import CustomerViewSet
from api.views_api.views_order import *
from api.views_api.views_product import *

router = DefaultRouter()
# router.register(r'order-products', ProductWithPriceViewSet, basename='order-product')
router.register(r'category', ProductCategoryViewSet, basename='category')
router.register(r'price', PriceViewSet, basename='price')
router.register(r'customer', CustomerViewSet, basename='customer')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'users', UserViewSet, basename='user')

order_item_list = OrderItemViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

order_item_detail = OrderItemViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy',
})

urlpatterns = [
    path('orders/<int:order_id>/items/', order_item_list, name='orderitem-list'),
    path('orders/<int:order_id>/items/<int:pk>/', order_item_detail, name='orderitem-detail'),
    # 📦 Продукти
    path('products/', ProductViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('products/<int:pk>/', ProductViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
    # 📦💰 Ціни конкретного продукту
    path('products/<int:product_id>/prices/', ProductPriceViewSet.as_view({'get': 'list'})),
    path('', include(router.urls)),
 
]
