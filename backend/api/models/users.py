from django.contrib.auth.models import AbstractUser         #type: ignore
from django.db import models                                #type: ignore

from api.models.roles import ROLE_CHOICES, CLIENT, MANAGER                                

class CustomUser(AbstractUser):
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=CLIENT)

    def is_client(self):
        return self.role == CLIENT

    def is_manager(self):
        return self.role == MANAGER
