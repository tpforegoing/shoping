from django.db import models                    #type: ignore
from django.conf import settings                 #type: ignore
# from django.db.models.base import Model

# Main class
class Thing(models.Model):
        # title of model
    title = models.CharField(max_length=255, default="")
        # description of model
    description = models.CharField(max_length=255,blank=True, null=True)
        # date when create the model
    created = models.DateTimeField(auto_now_add=True)
        # User whom is create the model
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL,
        related_name="created_by_%(app_label)s_%(class)s_related",
        related_query_name="created_by_%(app_label)s_%(class)ss",  
        editable=False, 
        null=True)
        # date when is update model
    updated = models.DateTimeField(auto_now=True)
        # User which update the model
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        related_name="updated_by_%(app_label)s_%(class)s_related",
        related_query_name="updated_by_%(app_label)s_%(class)ss",  
        editable=False, 
        null=True)

    def __str__(self):
        return self.title

    class Meta:
        abstract = True


