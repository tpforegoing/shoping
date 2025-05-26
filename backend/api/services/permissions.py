from rest_framework.permissions import BasePermission, SAFE_METHODS    #type: ignore
from api.models.roles import MANAGER, CLIENT

"""
Стратегічний патерн для визначення власника об'єкта (Owner) у системі авторизації.
Кожна стратегія реалізує метод get_owner(obj), який намагається витягти користувача-власника
з різної глибини вкладених об'єктів (user / customer.user / order.customer.user).
Це дозволяє перевірити, чи поточний користувач має право доступу до об'єкта.
"""
class BaseOwnerStrategy:
    """
    Базовий клас для стратегій. Метод має бути перевизначений у дочірніх класах.
    """
    def get_owner(self, obj):
        raise NotImplementedError

class DirectUserStrategy(BaseOwnerStrategy):
    # Повертає user напряму з obj.user (наприклад, модель Customer).
    def get_owner(self, obj):
        try:
            return getattr(obj, 'user', None)
        except Exception:
            return None

class CustomerUserStrategy(BaseOwnerStrategy):
    # Повертає user через obj.customer.user (наприклад, модель Order).
    def get_owner(self, obj):
        try:
            return getattr(getattr(obj, 'customer', None), 'user', None)
        except Exception:
            return None

class OrderCustomerUserStrategy(BaseOwnerStrategy):
    # Повертає user через obj.order.customer.user (наприклад, модель OrderItem).
    def get_owner(self, obj):
        try:
            return getattr(getattr(getattr(obj, 'order', None), 'customer', None), 'user', None)
        except Exception:
            return None


class OwnerResolver:
    def __init__(self):
        self.strategies = [
            DirectUserStrategy(),
            CustomerUserStrategy(),
            OrderCustomerUserStrategy(),
        ]

    def resolve(self, obj):
        for strategy in self.strategies:
            owner = strategy.get_owner(obj)
            if owner:
                return owner
        return None



def is_manager(user):
    return user.is_authenticated and user.role == MANAGER

def is_client(user):
    return user.is_authenticated and user.role == CLIENT


class IsManager(BasePermission):
    """
    Доступ лише для менеджера.
    """
    def has_permission(self, request, view):
        return is_manager(request.user)


class IsClient(BasePermission):
    """
    Доступ лише для клієнта.
    """
    def has_permission(self, request, view):
        return is_client(request.user)


class IsOwnerOrManager(BasePermission):
    """
    Менеджер має повний доступ.
    Клієнт має доступ лише до своїх об'єктів (наприклад, замовлень).
    """
    def has_object_permission(self, request, view, obj):

        if is_manager(request.user):
            return True

        owner = OwnerResolver().resolve(obj)
        if owner == request.user:
            return True

        print(
            f"[ACCESS DENIED] {request.user} намагався отримати доступ до чужого об'єкта {obj}"
        )
        return False

class ReadOnlyOrManager(BasePermission):
    """
    Читання дозволено всім, зміни — тільки менеджеру.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return is_manager(request.user)

class IsManagerOrAdmin(BasePermission):
    """
    Дозвіл лише для менеджерів або суперкористувача.
    """

    def has_permission(self, request, view):
        user = request.user
        return (
            user.is_authenticated and (
                user.is_superuser or
                getattr(user, 'role', None) == MANAGER
            )
        )