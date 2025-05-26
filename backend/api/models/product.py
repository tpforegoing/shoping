from django.db import models                            # type: ignore
from django.utils import timezone                       # type: ignore
from django.db.models.signals import post_save, pre_save # type: ignore
from django.dispatch import receiver                    # type: ignore

from api.models.models_thing import Thing                       

class ProductCategory(Thing):
    code = models.SlugField(max_length=50, unique=True)
    icon = models.CharField(max_length=100, blank=True, null=True, default=None)
    title = models.CharField(max_length=100)
    parent = models.ForeignKey('self', 
                               on_delete=models.SET_NULL, 
                               related_name='children', 
                               blank=True, null=True, 
                               verbose_name='Parent Category')
    full_title = models.CharField(max_length=500, blank=True, db_index=True)
    
    def __str__(self):
        return self.full_title
    
# 📦 Product
class Product(Thing):
    category = models.ForeignKey(ProductCategory, 
                                 on_delete=models.SET_NULL, 
                                 null=True, blank=True, 
                                 related_name='products')
    current_price_value = models.DecimalField(max_digits=10, decimal_places=2, 
                                             null=True, blank=True, db_index=True)
    current_price_id = models.PositiveIntegerField(null=True, blank=True)
    
    def __str__(self):
        return self.title
    
# 💰 Price
class Price(Thing):
    title = None
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='prices')
    value = models.DecimalField(max_digits=10, decimal_places=2)
    valid_from = models.DateTimeField(db_index=True)
    valid_to = models.DateTimeField(null=True, blank=True, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    description = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['-valid_from']
        indexes = [
            models.Index(fields=['product', 'is_active', 'valid_from'], 
                         name='price_validity_idx')
        ]

    def __str__(self):
        return f"💰{self.value} грн [📦]{self.product.title}) з {self.valid_from:%d.%m.%Y}"
    
    def is_valid_now(self):
        now = timezone.now()
        return (
            self.is_active and
            self.valid_from <= now and
            (self.valid_to is None or self.valid_to >= now)
        )

# Сигнали для ProductCategory
@receiver(pre_save, sender=ProductCategory)
def update_category_full_title(sender, instance, **kwargs):
    """Оновлює full_title перед збереженням категорії"""
    if instance.parent:
        try:
            parent = ProductCategory.objects.get(pk=instance.parent.pk)
            instance.full_title = f"{parent.full_title}. {instance.title}"
        except ProductCategory.DoesNotExist:
            instance.full_title = instance.title
    else:
        instance.full_title = instance.title

@receiver(post_save, sender=ProductCategory)
def update_children_categories(sender, instance, **kwargs):
    """Оновлює full_title для всіх дочірніх категорій"""
    for child in instance.children.all():
        child.save()  # Викличе pre_save для кожної дочірньої категорії

# Сигнал для оновлення current_price_value та current_price_id
@receiver(post_save, sender=Price)
def update_product_current_price(sender, instance, created, **kwargs):
    """Оновлює current_price_value та current_price_id продукту при збереженні ціни"""
    product = instance.product
    now = timezone.now()
    
    # Знаходимо поточну дійсну ціну
    current_price = Price.objects.filter(
        product=product,
        is_active=True,
        valid_from__lte=now
    ).filter(
        models.Q(valid_to__gte=now) | models.Q(valid_to__isnull=True)
    ).order_by('-valid_from').first()
    
    if current_price:
        # Оновлюємо продукт з інформацією про поточну ціну
        Product.objects.filter(pk=product.pk).update(
            current_price_value=current_price.value,
            current_price_id=current_price.id
        )
    else:
        # Дійсна ціна не знайдена
        Product.objects.filter(pk=product.pk).update(
            current_price_value=None,
            current_price_id=None
     )
