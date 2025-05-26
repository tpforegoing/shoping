import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../orders.service';
import { ProductService } from '../../products/products.service';
import { Product } from '../../products/products.model';
import { OrderItem } from '../orders.model';

@Component({
  selector: 'app-order-item-add-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './order-item-add-edit.component.html',
  styleUrl: './order-item-add-edit.component.scss'
})
export class OrderItemAddEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  orderItemForm!: FormGroup;
  isEditMode = false;
  orderId: number | null = null;
  orderItemId: number | null = null;
  loading = false;
  loadingProducts = false;
  products: Product[] = [];
  submitAttempted = false;

  ngOnInit(): void {
    this.initForm();
    
    const orderId = this.route.snapshot.paramMap.get('order');
    const itemId = this.route.snapshot.paramMap.get('id');
    
    if (!orderId) {
      this.snackBar.open('Не вказано ID замовлення', 'Закрити', {
        duration: 3000
      });
      this.router.navigate(['../../'], { relativeTo: this.route });
      return;
    }
    
    this.orderId = +orderId;
    this.loadProducts();
    
    if (itemId) {
      this.isEditMode = true;
      this.orderItemId = +itemId;
      this.loadOrderItem(this.orderId, this.orderItemId);
    }
  }

  private initForm(): void {
    this.orderItemForm = this.fb.group({
      product: [null, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price_at_time: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  private loadProducts(): void {
    this.loadingProducts = true;
    this.productService.getProducts({ page: 1 }).subscribe({
      next: (response) => {
        this.products = response.results;
        this.loadingProducts = false;
        
        // Автоматично встановлюємо ціну при виборі продукту
        this.orderItemForm.get('product')?.valueChanges.subscribe(productId => {
          if (productId) {
            const selectedProduct = this.products.find(p => p.id === productId);
            if (selectedProduct && selectedProduct.current_price_value) {
              this.orderItemForm.get('price_at_time')?.setValue(selectedProduct.current_price_value);
            }
          }
        });
      },
      error: (error) => {
        console.error('Error loading products', error);
        this.snackBar.open('Помилка завантаження списку товарів', 'Закрити', {
          duration: 3000
        });
        this.loadingProducts = false;
      }
    });
  }

  private loadOrderItem(orderId: number, itemId: number): void {
    // this.loading = true;
    // this.orderService.getOrderItems(orderId).subscribe({
    //   next: (items) => {
    //     const item = items.find(i => i.id === itemId);
    //     if (item) {
    //       this.orderItemForm.patchValue({
    //         product: item.product.id,
    //         quantity: item.quantity,
    //         price_at_time: item.price_at_time
    //       });
    //     } else {
    //       this.snackBar.open('Товар не знайдено в замовленні', 'Закрити', {
    //         duration: 3000
    //       });
    //       this.router.navigate(['../../detail', orderId], { relativeTo: this.route });
    //     }
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     console.error('Error loading order item', error);
    //     this.snackBar.open('Помилка завантаження даних товару', 'Закрити', {
    //       duration: 3000
    //     });
    //     this.loading = false;
    //     this.router.navigate(['../../detail', orderId], { relativeTo: this.route });
    //   }
    // });
  }

  onSubmit(): void {
    this.submitAttempted = true;
    
    if (this.orderItemForm.invalid || !this.orderId) {
      return;
    }
    
    this.loading = true;
    const orderItemData = {
      ...this.orderItemForm.value,
      order: this.orderId
    };
    
    if (this.isEditMode && this.orderItemId) {
      this.orderService.updateOrderItem(this.orderId, this.orderItemId, orderItemData).subscribe({
        next: () => {
          this.snackBar.open('Товар успішно оновлено', 'Закрити', {
            duration: 3000
          });
          this.loading = false;
          this.router.navigate(['../../detail', this.orderId], { relativeTo: this.route });
        },
        error: (error) => {
          console.error('Error updating order item', error);
          this.snackBar.open('Помилка оновлення товару', 'Закрити', {
            duration: 3000
          });
          this.loading = false;
        }
      });
    } else {
      this.orderService.createOrderItem(orderItemData).subscribe({
        next: () => {
          this.snackBar.open('Товар успішно додано до замовлення', 'Закрити', {
            duration: 3000
          });
          this.loading = false;
          this.router.navigate(['../../detail', this.orderId], { relativeTo: this.route });
        },
        error: (error) => {
          console.error('Error creating order item', error);
          this.snackBar.open('Помилка додавання товару до замовлення', 'Закрити', {
            duration: 3000
          });
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    if (this.orderId) {
      this.router.navigate(['../../detail', this.orderId], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.orderItemForm.get(controlName);
    
    if (control?.hasError('required')) {
      return 'Це поле обов\'язкове';
    }
    
    if (control?.hasError('min')) {
      return controlName === 'quantity' 
        ? 'Кількість повинна бути більше 0' 
        : 'Ціна повинна бути більше 0';
    }
    
    return '';
  }
}
