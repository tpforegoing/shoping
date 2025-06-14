from django.core.management.base import BaseCommand                 # type: ignore
from django.db import transaction, connection                       # type: ignore
from django.utils import timezone                                   # type: ignore
import time
from api.models.product import Product, ProductCategory, Price
class Command(BaseCommand):
    help = 'Масове оновлення денормалізованих полів для продуктів'

    def add_arguments(self, parser):
        parser.add_argument(
            '--batch-size',
            type=int,
            default=1000,
            help='Кількість записів для обробки в кожній партії'
        )
        parser.add_argument(
            '--sleep',
            type=float,
            default=0.1,
            help='Час сну між партіями (секунди)'
        )

    def handle(self, *args, **options):
        batch_size = options['batch_size']
        sleep_time = options['sleep']
        
        start_time = time.time()
        
        self.stdout.write('Оновлення current_price для продуктів...')
        self.update_products_current_price(batch_size, sleep_time)
        
        elapsed_time = time.time() - start_time
        self.stdout.write(
            self.style.SUCCESS(f'Успішно оновлено всі поля за {elapsed_time:.2f} секунд')
        )
    def update_categories_full_title(self, batch_size, sleep_time):
        """
        Оновлює full_title для всіх категорій, починаючи з кореневих
        і рухаючись вниз по ієрархії
        """
        # Спочатку оновлюємо кореневі категорії
        with transaction.atomic():
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE api_productcategory
                    SET full_title = title
                    WHERE parent_id IS NULL
                """)
                self.stdout.write(f'Оновлено кореневі категорії')
        
        # Потім оновлюємо кожен рівень ієрархії
        level = 1
        while True:
            with transaction.atomic():
                # Використовуємо SQL для ефективного оновлення
                with connection.cursor() as cursor:
                    cursor.execute(f"""
                        WITH updated_categories AS (
                            SELECT c.id, CONCAT(p.full_title, '. ', c.title) AS new_full_title
                            FROM api_productcategory c
                            JOIN api_productcategory p ON c.parent_id = p.id
                            WHERE p.full_title IS NOT NULL 
                              AND p.full_title != ''
                              AND (c.full_title IS NULL 
                                  OR c.full_title = '' 
                                  OR c.full_title != CONCAT(p.full_title, '. ', c.title))
                            LIMIT {batch_size}
                        )
                        UPDATE api_productcategory
                        SET full_title = uc.new_full_title
                        FROM updated_categories uc
                        WHERE api_productcategory.id = uc.id
                        RETURNING api_productcategory.id
                    """)
                    updated_ids = cursor.fetchall()
                    count = len(updated_ids)
            
            if count == 0:
                break
                
            self.stdout.write(f'Оновлено {count} категорій на рівні {level}')
            level += 1
            time.sleep(sleep_time)  # Невелика пауза для зменшення навантаження

    def update_products_current_price(self, batch_size, sleep_time):
        """
        SQLite-сумісна версія оновлення current_price_value та current_price_id.
        Без raw SQL: через ORM + bulk_update.
        """
        from django.utils.timezone import now
        from django.db.models import Q

        now_time = now()
        qs = Product.objects.all().prefetch_related('prices')
        total = qs.count()
        
        self.stdout.write(f'Всього продуктів для обробки: {total}')
        
        offset = 0
        while offset < total:
            batch = qs[offset:offset + batch_size]
            updated = []

            for product in batch:
                # Отримуємо актуальну ціну
                valid_prices = product.prices.filter(
                    is_active=True,
                    valid_from__lte=now_time
                ).filter(
                    Q(valid_to__gte=now_time) | Q(valid_to__isnull=True)
                ).order_by('-valid_from')

                price = valid_prices.first()
                product.current_price_value = price.value if price else None
                product.current_price_id = price.id if price else None
                updated.append(product)

            # Масове оновлення (ORM)
            Product.objects.bulk_update(updated, ['current_price_value', 'current_price_id'])

            self.stdout.write(f'✅ Оновлено {len(updated)} продуктів (offset {offset})')
            offset += batch_size
            time.sleep(sleep_time)
