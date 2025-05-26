###################### import Django module ###########################
from django.core.exceptions import ObjectDoesNotExist                  #type: ignore

from rest_framework.permissions import IsAuthenticated, BasePermission  #type: ignore
from rest_framework.response import Response                            #type: ignore
from rest_framework.pagination import PageNumberPagination              #type: ignore
from rest_framework.viewsets import ModelViewSet                        #type: ignore
from rest_framework.filters import SearchFilter, OrderingFilter         #type: ignore
from rest_framework.exceptions import PermissionDenied                  #type: ignore
from knox.auth import TokenAuthentication                               #type: ignore

from django.conf import settings                                        #type: ignore
from api.models.roles import CLIENT, MANAGER       

class DefaultPagination(PageNumberPagination):
    page_size = getattr(settings, 'PAGE_SIZE', 50)

class GenericThingViewSet(ModelViewSet):
    """
    Цей клас підтримує:
    кастомні permission_classes на рівні дій (list, create, destroy тощо),
    динамічні серіалізатори (serializer_map),
    пагінацію,
    пошук і сортування.
    """
    # ✅ Додай це обов'язково, інакше не буде працювати безпека
    authentication_classes = [TokenAuthentication]      # Knox токен-автентифікація
    permission_classes = [IsAuthenticated]
    permission_classes_map = {}
    filter_backends = [ SearchFilter, OrderingFilter]
    pagination_class = DefaultPagination  # ✅ Додай це

    model = None
    serializer_class = None
    serializer_map = {}
    search_fields = []
    ordering_fields = '__all__'

    def get_permissions(self):
        """
        Динамічно обирає permission_classes для кожної дії.
        """
        action = self.action
        perms = self.permission_classes_map.get(action, self.permission_classes)
        return [perm() for perm in perms]
    
    def get_queryset(self):
        return self.model.objects.all().order_by('id')

    def get_serializer_class(self):
        action = self.action
        return self.serializer_map.get(action, self.serializer_class)

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user,
            updated_by=self.request.user
        )

    def perform_update(self, serializer):
        serializer.save(
            updated_by=self.request.user
        )

    def list(self, request, *args, **kwargs):
        # print("🔍 inside list")
        # print("🔐 Authenticated user:", request.user)
        # print("🔎 Query params:", request.query_params)
        # print("📄 Page size:", getattr(self.paginator, 'page_size', '🚫 NO PAGINATOR'))

        queryset = self.filter_queryset(self.get_queryset())
        # print(f"🧪 FILTERED QUERYSET: {queryset}, type: {type(queryset)}")

        page = self.paginate_queryset(queryset)
        # print(f"📦 Paginator class: {getattr(self, 'pagination_class', None)}")
        # print(f"📦 Actual paginator: {getattr(self, 'paginator', None)}")
        if page is not None:
            # print(f"📄 Page object: {page}")

            serializer = self.get_serializer(page, many=True)
            # print(f"✅ Returning paginated data: {len(serializer.data)} items")
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        # print(f"⚠️ No pagination applied, total items: {len(serializer.data)}")
        return Response(serializer.data)

