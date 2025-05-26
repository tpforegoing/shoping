from django.db import models                    #type: ignore
from django.conf import settings                #type: ignore

from api.models.models_thing import Thing                 

# 👤 Customer
class Customer(Thing):
    title = None
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    code = models.CharField(max_length = 12, unique=True)
    name = models.CharField(max_length=150)
    phone_no = models.CharField(max_length=30, blank=True)


    def __str__(self):
        return f"[{self.code}]: {self.name} {self.user.username}"
    

