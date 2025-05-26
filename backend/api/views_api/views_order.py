from rest_framework.permissions import IsAuthenticated  #type: ignore
from rest_framework.decorators import action            #type: ignore
from rest_framework.response import Response            #type: ignore 
from rest_framework.exceptions import PermissionDenied  #type: ignore
from rest_framework import filters                      #type: ignore
from rest_framework.exceptions import ValidationError   #type: ignore
# from rest_framework import status                       #type: ignore

from api.models.roles import MANAGER
from api.services.permissions import IsOwnerOrManager
from api.models.order import Order, OrderItem
from api.models.customer import Customer
from api.serializers.order import OrderItemSerializer, OrderSerializer, OrderWithItemsSerializer
from api.views_api.views_thing import GenericThingViewSet

class OrderViewSet(GenericThingViewSet):
    model = Order
    serializer_class = OrderSerializer

    permission_classes_map = {
        'list': [IsOwnerOrManager],
        'retrieve': [IsOwnerOrManager],
        'create': [IsAuthenticated],
        'update': [IsOwnerOrManager],
        'partial_update': [IsOwnerOrManager],
        'destroy': [IsOwnerOrManager],
    }
    filter_backends = [filters.SearchFilter, filters.OrderingFilter] 
    filterset_fields = ['status']
    search_fields = ['id', 'status', 'customer__name']
    ordering_fields= ['customer__name', 'status']
    ordering = ['customer__name','status']

    def get_queryset(self):
        user = self.request.user
        if user.role == MANAGER:
            return super().get_queryset().select_related('customer__user').prefetch_related('items')

        return self.model.objects.filter(customer__user=user).order_by('id').select_related('customer').prefetch_related('items')

    def perform_create(self, serializer):
        user = self.request.user

        if user.role == MANAGER:
            # менеджер має право передавати customer.id
            customer_id = self.request.data.get('customer')
            if not customer_id:
                raise ValidationError('Поле "customer" обовʼязкове для менеджера.')
            try:
                customer = Customer.objects.get(id=customer_id)
            except Customer.DoesNotExist:
                raise ValidationError('Клієнта з таким ID не знайдено.')
        else:
            # клієнт — використовує лише свого
            try:
                customer = Customer.objects.get(user=user)
            except Customer.DoesNotExist:
                raise ValidationError('Ваш профіль клієнта не знайдено.')

        serializer.save(
            customer=customer,
            created_by=user,
            updated_by=user
        )

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    @action(detail=True, methods=["get"], url_path="items", permission_classes=[IsAuthenticated])
    def retrieve_items(self, request, pk=None):
        order = self.get_object()  # має пройти перевірку IsOwnerOrManager
        serializer = OrderWithItemsSerializer(order)
        return Response(serializer.data)

def validate_order_editable(self, order_id):
    order = Order.objects.get(id=order_id)
    if order.status in ['submitted', 'paid']:
        raise ValidationError(f'Замовлення зі статусом "{order.get_status_display()}" не можна змінювати.')
    return order

class OrderItemViewSet(GenericThingViewSet):
    model = OrderItem
    serializer_class = OrderItemSerializer

    permission_classes_map = {
        'list': [IsOwnerOrManager],
        'retrieve': [IsOwnerOrManager],
        'create': [IsAuthenticated],
        'update': [IsOwnerOrManager],
        'partial_update': [IsOwnerOrManager],
        'destroy': [IsOwnerOrManager],
    }

    filterset_fields = ['order', 'product']
    search_fields = ['product__title']

    def get_queryset(self):
        user = self.request.user
        order_id = self.kwargs.get('order_id')

        qs = self.model.objects.filter(order_id=order_id).order_by('id')

        if user.role == MANAGER:
            return qs.select_related('order', 'product')

        return qs.filter(order__customer__user=user).select_related('order', 'product')

    def get_object(self):
        obj = super().get_object()
        order_id = self.kwargs.get('order_id')
        if obj.order_id != int(order_id):
            raise PermissionDenied("This item does not belong to the specified order.")
        return obj

    def perform_create(self, serializer):
        order_id = self.kwargs.get('order_id')
        order = self.validate_order_editable(order_id)

        serializer.save(order=order, 
                        created_by=self.request.user, 
                        updated_by=self.request.user)

    def perform_update(self, serializer):
        order = self.validate_order_editable(serializer.instance.order_id)
        serializer.save(updated_by=self.request.user)

    def perform_destroy(self, instance):
        order = self.validate_order_editable(instance.order_id)
        instance.delete()