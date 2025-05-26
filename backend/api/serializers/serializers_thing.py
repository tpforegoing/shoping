from rest_framework import serializers                           #type: ignore



from api.models.models_thing import Thing
from api.serializers.users import CustomUserSerializer

class ThingSerializer(serializers.ModelSerializer):
    created = serializers.DateTimeField(format="%Y.%m.%d %H:%M:%S", default_timezone=None)
    updated = serializers.DateTimeField(format="%Y.%m.%d %H:%M:%S", default_timezone=None)
    created_by = serializers.CharField(read_only=True)
    updated_by = serializers.CharField(read_only=True)
    class Meta:
        model = Thing
        fields = [
            'title',
            'description'
        ]
        abstract = True

