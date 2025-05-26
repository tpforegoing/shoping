from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from api.models.users import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Роль", {"fields": ("role",)}),
    )
    list_display = UserAdmin.list_display + ("role",)