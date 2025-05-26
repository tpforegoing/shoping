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
import { CustomerService } from '../../clients/clients.service';
import { Customer } from '../../clients/clients.model';
import { Order } from '../orders.model';

@Component({
  selector: 'app-order-add-edit',
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
  templateUrl: './order-add-edit.component.html',
  styleUrl: './order-add-edit.component.scss'
})
export class OrderAddEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private customerService = inject(CustomerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  orderForm!: FormGroup;
  isEditMode = false;
  orderId: number | null = null;
  loading = false;
  loadingCustomers = false;
  customers: Customer[] = [];
  submitAttempted = false;

  statusOptions = [
    { value: 'draft', label: 'Чернетка' },
    { value: 'submitted', label: 'Очікує оплату' },
    { value: 'paid', label: 'Оплачено' },
    { value: 'cancelled', label: 'Скасовано' }
  ];

  ngOnInit(): void {
    this.initForm();
    this.loadCustomers();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.orderId = +id;
      this.loadOrder(this.orderId);
    }
  }

  private initForm(): void {
    this.orderForm = this.fb.group({
      customer: [null, [Validators.required]],
      status: ['draft', [Validators.required]]
    });
  }

  private loadCustomers(): void {
    this.loadingCustomers = true;
    this.customerService.getCustomers({ page: 1 }).subscribe({
      next: (response) => {
        this.customers = response.results;
        this.loadingCustomers = false;
      },
      error: (error) => {
        console.error('Error loading customers', error);
        this.snackBar.open('Помилка завантаження списку клієнтів', 'Закрити', {
          duration: 3000
        });
        this.loadingCustomers = false;
      }
    });
  }

  private loadOrder(id: number): void {
    this.loading = true;
    this.orderService.getById(id).subscribe({
      next: (order) => {
        this.orderForm.patchValue({
          customer: order.customer.id,
          status: order.status
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order', error);
        this.snackBar.open('Помилка завантаження даних замовлення', 'Закрити', {
          duration: 3000
        });
        this.loading = false;
        this.router.navigate(['../'], { relativeTo: this.route });
      }
    });
  }

  onSubmit(): void {
    this.submitAttempted = true;
    
    if (this.orderForm.invalid) {
      return;
    }
    
    this.loading = true;
    const orderData = this.orderForm.value;
    
    if (this.isEditMode && this.orderId) {
      this.orderService.updateOrder(this.orderId, orderData).subscribe({
        next: () => {
          this.snackBar.open('Замовлення успішно оновлено', 'Закрити', {
            duration: 3000
          });
          this.loading = false;
          this.router.navigate(['../detail', this.orderId], { relativeTo: this.route });
        },
        error: (error) => {
          console.error('Error updating order', error);
          this.snackBar.open('Помилка оновлення замовлення', 'Закрити', {
            duration: 3000
          });
          this.loading = false;
        }
      });
    } else {
      this.orderService.createOrder(orderData).subscribe({
        next: (order) => {
          this.snackBar.open('Замовлення успішно створено', 'Закрити', {
            duration: 3000
          });
          this.loading = false;
          this.router.navigate(['../detail', order.id], { relativeTo: this.route });
        },
        error: (error) => {
          console.error('Error creating order', error);
          this.snackBar.open('Помилка створення замовлення', 'Закрити', {
            duration: 3000
          });
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  getErrorMessage(controlName: string): string {
    const control = this.orderForm.get(controlName);
    
    if (control?.hasError('required')) {
      return 'Це поле обов\'язкове';
    }
    
    return '';
  }
}
