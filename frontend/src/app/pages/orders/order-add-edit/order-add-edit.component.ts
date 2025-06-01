import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { selectError, selectLoading, selectOrderById, selectParams } from '../store/orders/orders.selectors';
import { LoadParams, QueryParams } from '../../../store/store.model';
import { map, Observable, take } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Actions, ofType } from '@ngrx/effects';
import { OrdersActions } from '../store/orders/orders.actions';

import { OrderSubmit } from '../orders.model';
import { CustomerActions } from '../../clients/store/client.actions';
import {  selectCustomers } from '../../clients/store/client.selectors';

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
export class OrderAddEditComponent{
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private action$ = inject(Actions);
  private fb = inject(FormBuilder);
  
  readonly queryParams = toSignal(this.route.queryParams as Observable<QueryParams>, {
    initialValue: { sourceUrl: ''},
  })
  readonly query = computed((): LoadParams => {
    const raw = this.queryParams() as Params;
    return {
      page: +(raw['page'] || 1),
      filter: raw['filter'] || '',
      ordering: raw['ordering'] || '',
    };
  });
  // 
  readonly sourceUrl = computed(() => this.queryParams()?.sourceUrl || '/');
  // --- ID з route параметра
  readonly orderId = toSignal(
    this.route.paramMap.pipe(map(p => +(p.get('id') || 0))),
    { initialValue: -1 }
  )
  // 
  readonly selectedOrder = this.store.selectSignal(selectOrderById(this.orderId()));
    // --- Визначення режиму
  readonly isEditMode = computed(() => this.orderId() !== null && this.selectedOrder !== null);
  // readonly customers = this.store.selectSignal(selectSelectedOrder);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly error = this.store.selectSignal(selectError);
  readonly params = this.store.selectSignal(selectParams);
  
  readonly customers = this.store.selectSignal(selectCustomers);
  readonly user = this.store.selectSignal(selectCustomers);

  orderForm!: FormGroup;
  submitAttempted = false;

  statusOptions = [
    { value: 'draft', label: 'Чернетка' },
    { value: 'submitted', label: 'Очікує оплату' },
    { value: 'paid', label: 'Оплачено' },
    { value: 'cancelled', label: 'Скасовано' }
  ];

  constructor() { 
    this.initForm();
    // отримати замовлення
    effect(() => {
      const idValue = this.orderId();
      if (idValue  > 0) {
        this.store.dispatch(OrdersActions.details({ id: idValue }));
      }
    })
    // отримати користувачів
    effect(() => {
      this.store.dispatch(CustomerActions.load({params: this.query()}));
    });
    // реакція на зміну форми
    effect(() => {
      const order = this.selectedOrder();
      const id = this.orderId();
      const customers = this.customers();
      if (id > 0 && order) {
        this.orderForm.patchValue({
          customer: typeof order.customer === 'object' ? order.customer.id : order.customer,
          status: order.status
        });
      }
      if (id <= 0 && customers.length > 0) {
        this.orderForm.patchValue({
          customer: customers[0].id
        });
      }     
    });

  }

  private initForm(): void {
    this.orderForm = this.fb.group({
      customer: [null, [Validators.required]],
      status: ['draft', [Validators.required]]
    });
  }

  onSubmit(): void {
    this.submitAttempted = true;
    
    if (this.orderForm.invalid) return;

    const value: Partial<OrderSubmit> ={
        customer: this.orderForm.get('customer')?.value,
        status: this.orderForm.get('status')?.value
    };

    const action =this.isEditMode()
      ? OrdersActions.update({ id: this.orderId()!, changes: value })
      : OrdersActions.create({ order: value });
     
    const successType = this.isEditMode()
      ? OrdersActions.updateSuccess
      : OrdersActions.createSuccess;

    this.action$.pipe(
      ofType(successType),
      take(1)
    ).subscribe({
        next: () => this.onBack(),
        error: (err) => {
          this.snackBar.open('Помилка завантаження даних клієнта', 'Закрити', {
            duration: 3000
          });
        }         
      } 
    );
    this.store.dispatch(action);
  }

  getErrorMessage(controlName: string): string {
    const control = this.orderForm.get(controlName);
    
    if (control?.hasError('required')) {
      return 'Це поле обов\'язкове';
    }
    
    return '';
  }
  onBack(): void {
    const backUrl = this.sourceUrl();
    this.router.navigateByUrl(backUrl);
  }
}
