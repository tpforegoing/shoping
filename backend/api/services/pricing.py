from django.utils import timezone                               # type: ignore
from django.db import models                                    # type: ignore
from api.models.product import Product, Price


def get_applicable_price(product):
    """
    Повертає найактуальнішу активну ціну для товару.
    Спочатку перевіряє current_price_id, якщо він є.
    """
    if product.current_price_id:
        try:
            price = Price.objects.get(id=product.current_price_id)
            if price.is_valid_now():
                return price
        except Price.DoesNotExist:
            pass
    
    # Якщо current_price_id не встановлено або ціна не дійсна, шукаємо актуальну
    now = timezone.now()
    return Price.objects.filter(
        product=product,
        is_active=True,
        valid_from__lte=now
    ).filter(
        models.Q(valid_to__gte=now) | models.Q(valid_to__isnull=True)
    ).order_by('-valid_from').first()
