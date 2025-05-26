import { Component,  computed,  effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { PriceActions } from '../store/price.actions';
import { Price, PriceSubmit } from '../price.model';
import { Product } from '../../products/products.model';
import { ProductService } from '../../products/products.service';
import {  selectError, selectPriceById } from '../store/price.selectors';
import { ACTION_CREATE, ACTION_UPDATE } from '../../../store/store.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectProductById, selectProducts } from '../../products/store/product.selectors';
import { ProductActions } from '../../products/store/product.actions';

@Component({
  selector: 'app-price-add-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [
    provideNativeDateAdapter() // Add this line to provide the native date adapter
  ],
  templateUrl: './price-add-edit.component.html',
  styleUrls: ['./price-add-edit.component.scss']
})
export class PriceAddEditComponent{
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  private actions$ = inject(Actions);

  readonly ACTION_CREATE = ACTION_CREATE;
  readonly ACTION_UPDATE = ACTION_UPDATE;
  // --- Signals ---
  readonly qParams = toSignal(this.route.queryParams, { initialValue: {} });
  readonly productId = computed(() => +(this.qParams()as Params)['product'] || null);

  // --- Select product from store ---
  readonly product = computed(() => {
    const id = this.productId();
    return id ? toSignal(this.store.select(selectProductById(id)), { initialValue: null })() : null;
  });

  // --- Error from store ---
  readonly error = this.store.selectSignal(selectError);

  // // 
  // id = signal<number | null>(null);
  // //
  // queryParams = this.route.snapshot.queryParams;
  // // 
  // selectedPrice = signal<Price | null>(null);
  // // 
  // allProducts = toSignal(this.store.select(selectProducts), { initialValue: [] });
  
  // --- Form ---
  readonly form = this.fb.group({
    value: this.fb.control<number | null>(null, { validators: Validators.required }),
    valid_from: this.fb.control<Date>(new Date(), { validators: Validators.required }),
    valid_to: this.fb.control<Date | null>(null),
    is_active: this.fb.control<boolean>(true),
    description: this.fb.control<string>(''),
  });
  // form = this.fb.group({
  //     product: this.fb.control<number | null>(null,{validators: Validators.required}),
  //     value: this.fb.control<number>(0, {validators: Validators.required}),
  //     valid_from: this.fb.control<Date>(new Date(), {validators: Validators.required}),
  //     valid_to: this.fb.control<Date | null>(null),
  //     is_active: this.fb.control<boolean>(true),
  //     description: this.fb.control<string>(''),
  //   //   value: [0, Validators.required],
  //   });
 // Визначаємо чи редагування
  isEdit = computed(() => this.id() !== null && this.selectedPrice() !== null);

  constructor() {
   
    this.store.dispatch(ProductActions.load({ page: 1}));
    // console.log('PriceAddEditComponent constructor', this.allProducts());
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const priceId = +idParam;
      this.id.set(priceId);
      // Завантажуємо price відразу з бекенда
      this.store.dispatch(PriceActions.details({ id: priceId }));
      // Слухаємо результат напряму зі store
      const price$ = this.store.select(selectPriceById(priceId));
      const priceSignal = toSignal(price$,{initialValue: null});
      effect(() => {
        const price = priceSignal();
        if (price) {
          this.selectedPrice.set(price);
          this.form.patchValue({
            product: typeof price.product === 'number' ? price.product : price.product.id,
            value: parseFloat(price.value),
            valid_from: new Date(price.valid_from),
            valid_to: price.valid_to ? new Date(price.valid_to) : null,
            is_active: price.is_active,
            description: price.description
          });
        }
      });
      effect(() => {
        const products = this.allProducts();
      });
    }
  }

  onSubmit(): void {
    console.log('onSubmit');
    if (this.form.invalid) return;
    console.log('onSubmit, value: ', this.form.value);
    
    const formValue = this.form.value;
    const value: Partial<PriceSubmit> = {
      product: formValue.product ?? -1,
      value: formValue.value ?? -1,
      valid_from: formValue.valid_from ? formValue.valid_from.toISOString() : '',
      valid_to: formValue.valid_to ? formValue.valid_to.toISOString() : null,
      is_active: formValue.is_active ?? false,
      description: formValue.description ?? ''
    };
  
    const action = this.isEdit() && this.id()
      ? PriceActions.update({ id: this.id()!, changes: value })
      : PriceActions.create({ price: value });
    console.log('onSubmit, action: ', action);
    const successType = this.isEdit()
      ? PriceActions.updateSuccess
      : PriceActions.createSuccess;
    console.log('onSubmit, successType: ', successType);
    this.actions$.pipe(
      ofType(successType),
      take(1)
    ).subscribe(() => this.onBack());

    this.store.dispatch(action);
  }

  onBack(): void {
    this.store.dispatch(PriceActions.resetError());
    this.store.dispatch(PriceActions.back({ queryParams: this.queryParams }));
    // this.router.navigate(['/prices']);
  }
}
