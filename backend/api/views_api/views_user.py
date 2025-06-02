from rest_framework.viewsets import ReadOnlyModelViewSet     # type: ignore
from rest_framework.permissions import IsAuthenticated           # type: ignore
from api.models.users import CustomUser
from api.serializers.users import CustomUserSerializer

from api.services.permissions import IsManagerOrAdmin  # якщо потрібно

class UserViewSet(ReadOnlyModelViewSet):
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Returns a queryset of all users if the current user is a superuser,
        otherwise returns a queryset containing only the current user.
        """
        user = self.request.user
        if user.is_superuser:
            return CustomUser.objects.all()
        return CustomUser.objects.filter(id=user.id)