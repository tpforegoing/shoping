from api.models.roles import MANAGER
from api.services.permissions import IsManager, IsOwnerOrManager
from api.models.customer import Customer
from api.serializers.customer import CustomerSerializer
from api.views_api.views_thing import GenericThingViewSet          

# 👤 Customer
class CustomerViewSet(GenericThingViewSet):
    model = Customer
    serializer_class = CustomerSerializer
    serializer_map = {
        'list': CustomerSerializer,
        'retrieve': CustomerSerializer,
        'update': CustomerSerializer,
        'partial_update': CustomerSerializer,
    }

    permission_classes_map = {
        'list': [IsOwnerOrManager],
        'retrieve': [IsOwnerOrManager],
        'update': [IsOwnerOrManager],
        'partial_update': [IsOwnerOrManager],
        'create': [IsManager],
        'destroy': [IsManager],
    }

    filterset_fields = ['code', 'name']
    search_fields = ['code', 'name', 'phone_no']

    def get_queryset(self):
        user = self.request.user
        if user.role == MANAGER:
            return super().get_queryset().order_by('id')
        return self.model.objects.filter(user=user).order_by('id')

    def perform_create(self, serializer):
        # тільки менеджер створює → user передається з фронту
        serializer.save()

    def perform_update(self, serializer):
        # забороняємо змінювати user для всіх
        serializer.save(user=self.get_object().user)