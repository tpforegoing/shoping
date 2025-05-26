from django.contrib import admin                        #type: ignore
from api.models.customer import Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('code','id', 'name','user', 'phone_no')
    search_fields = ('code', 'name', 'user__username', 'phone_no')
