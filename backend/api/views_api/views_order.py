from rest_framework.permissions import IsAuthenticated  #type: ignore
from rest_framework.decorators import action            #type: ignore
from rest_framework.response import Response            #type: ignore 
from rest_framework.exceptions import PermissionDenied  #type: ignore
from rest_framework import filters                      #type: ignore
from rest_framework.exceptions import ValidationError, NotFound   #type: ignore
# from rest_framework import status                       #type: ignore

from api.models.roles import MANAGER
from api.services.permissions import IsOwnerOrManager
from api.models.order import Order, OrderItem
from api.models.customer import Customer
from api.serializers.order import *
from api.views_api.views_thing import GenericThingViewSet

class OrderViewSet(GenericThingViewSet):
    model = Order
    serializer_class = OrderSerializer
    serializer_map = {
        'list': OrderSerializer,
        'retrieve': OrderWithItemsSerializer,
        'create': OrderWithItemsCreateSerializer,
        'update': OrderWithItemsSerializer,
        'partial_update': OrderWithItemsSerializer,
        'destroy': OrderSerializer
    }
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
        """
        Перевизначає стандартний метод get_queryset для фільтрування замовлень
        за статусом. Якщо користувач - менеджер, то повертає всі замовлення,
        інакше - тільки ті, які належать цьому користувачу.
        """
        
        user = self.request.user
        params = self.request.query_params

        queryset = super().get_queryset() if user.role == MANAGER else self.model.objects.filter(customer__user=user)

        # ручна фільтрація
        status = params.get('status')
        if status:
            queryset = queryset.filter(status=status)

        created_from = params.get('created_at_after')
        if created_from:
            queryset = queryset.filter(created_at__gte=created_from)

        created_to = params.get('created_at_before')
        if created_to:
            queryset = queryset.filter(created_at__lte=created_to)

        customer_id = params.get('customer')
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)


        return queryset.select_related('customer__user').prefetch_related('items')       

    def perform_create(self, serializer):
        """
        Перевизначає стандартний метод perform_create для створення замовлення
        з врахуванням ролі користувача. Менеджер передає customer_id,
        клієнт - використовує лише свого.
        """
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
        """
        Перевизначає стандартний метод perform_update для оновлення замовлення
        з врахуванням ролі користувача. Менеджер може оновлювати замовлення,
        клієнт - лише свої.
        """
        serializer.save(updated_by=self.request.user)

    def validate_order_editable(self, order_id):
        """
        Перевіряє, чи може бути змінено замовлення з даним ID.
        Менеджер може змінити будь-яке замовлення, клієнт - лише свої.
        """
        order = Order.objects.get(id=order_id)
        if order.status in ['submitted', 'paid']:
            raise ValidationError(f'Замовлення зі статусом "{order.get_status_display()}" не можна змінювати.')
        return order

class OrderItemViewSet(GenericThingViewSet):
    model = OrderItem
    serializer_class = OrderItemSerializer
    serializer_map = {
        'list': OrderWithItemsSerializer,
        'retrieve': OrderItemSerializer,
        'create': OrderItemEditSerializer,
        'update': OrderItemEditSerializer,
        'partial_update': OrderItemEditSerializer,
        'destroy': OrderItemSerializer,

    }
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

    def list(self, request, order_id=None, *args, **kwargs):
        """
        Повертає одне замовлення з повним переліком товарів.
        """
        try:
            order = Order.objects.select_related('customer__user').prefetch_related(
                'items__product__category'
            ).get(id=order_id)
        except Order.DoesNotExist:
            raise NotFound("Замовлення не знайдено.")

        if not IsOwnerOrManager().has_object_permission(request, self, order):
            raise PermissionDenied("Недостатньо прав доступу.")
        
        serializer = OrderWithItemsSerializer(order, context={'request': request})
        return Response(serializer.data)

    def get_queryset(self):
        """
        Перевизначає стандартний метод get_queryset для фільтрування позицій
        замовлення за замовленням. Якщо користувач - менеджер, то повертає всі
        позиції замовлення, інакше - тільки ті, які належать цьому користувачу.
        """ 
        user = self.request.user
        order_id = self.kwargs.get('order_id')

        qs = self.model.objects.filter(order_id=order_id).order_by('id')

        if user.role == MANAGER:
            return qs.select_related('order', 'product')

        return qs.filter(order__customer__user=user).select_related('order', 'product')

    def get_object(self):
        """
        Перевизначає стандартний метод get_object для фільтрування позицій
        замовлення за замовленням. Якщо користувач - менеджер, то повертає всі
        позиції замовлення, інакше - тільки ті, які належать цьому користувачу.
        """
        obj = super().get_object()
        order_id = self.kwargs.get('order_id')
        if obj.order_id != int(order_id):
            raise PermissionDenied("This item does not belong to the specified order.")
        return obj

    def perform_create(self, serializer):
        """
        Перевизначає стандартний метод perform_create для створення позиції
        замовлення з врахуванням ролі користувача. Менеджер може створювати
        позиції для будь-якого замовлення, клієнт - лише для власних.
        """
        order_id = self.kwargs.get('order_id')
        order = self.validate_order_editable(order_id)

        product = serializer.validated_data['product']
        price = product.current_price_value

        if not price:
            raise ValidationError('У продукту відсутня актуальна ціна.')
        
        serializer.save(order=order, 
                        product=product,
                        price_at_time=price,
                        created_by=self.request.user, 
                        updated_by=self.request.user)

    def perform_update(self, serializer):
        """
        Перевизначає метод perform_update:
        - перевірка, чи замовлення можна редагувати;
        - оновлення ціни, якщо змінено продукт;
        - оновлення updated_by.
        """
        order = self.validate_order_editable(serializer.instance.order_id)
        product = serializer.validated_data.get('product', serializer.instance.product)

        # отримаємо актуальну ціну (денормалізовану)
        price = product.current_price_value
        if price is None:
            raise ValidationError("У продукту немає актуальної ціни.")

        serializer.save(
            order=order,
            product=product,
            updated_by=self.request.user,
            price_at_time=price
        )

    def perform_destroy(self, instance):
        """
        Перевизначає стандартний метод perform_destroy для видалення позиції
        замовлення з врахуванням ролі користувача. Менеджер може видаляти
        позиції для будь-якого замовлення, клієнт - лише для власних.
        """
        order = self.validate_order_editable(instance.order_id)
        instance.delete()

    def validate_order_editable(self, order_id):
        """
        Перевіряє, чи може бути змінено замовлення з даним ID.
        Менеджер може змінити будь-яке замовлення, клієнт - лише свої.
        """
        order = Order.objects.get(id=order_id)
        if order.status in ['submitted', 'paid']:
            raise ValidationError(f'Замовлення зі статусом "{order.get_status_display()}" не можна змінювати.')
        return order