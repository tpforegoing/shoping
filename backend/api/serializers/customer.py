from rest_framework import serializers                 #type: ignore

from api.models.customer import Customer
from api.serializers.users import CustomUserSerializer

class CustomerSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = Customer
        fields = ['id', 'code', 'name', 'user', 'phone_no','created', 'updated']
