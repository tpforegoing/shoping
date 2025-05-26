import { Component,  computed,  effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

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
// import { Price, PriceSubmit } from '../price.model';
import { selectError, selectPriceById } from '../store/price.selectors';
import { ProductActions } from '../../products/store/product.actions';
import { selectProductById, selectProducts } from '../../products/store/product.selectors';
import { Price } from '../price.model';
import { Product } from '../../products/products.model';
import { QueryParams } from '../../../store/store.model';


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

  // --- Форма
  form = this.fb.group({
      value: this.fb.control<number>(0, {validators: Validators.required}),
      valid_from: this.fb.control<Date>(new Date(), {validators: Validators.required}),
      valid_to: this.fb.control<Date | null>(null),
      is_active: this.fb.control<boolean>(true),
      description: this.fb.control<string>(''),
  });
  // --- Signals ---
  readonly queryParams = toSignal(this.route.queryParams, { initialValue: {} });
  readonly productId = computed(() => +(this.queryParams()as Params)['product'] || null);
  readonly productIDSignal = signal<number | null>(null);
  readonly productSignal = signal<Product | null>(null);
  readonly sourceUrl = signal<string | null>(null);

  // --- ID з route параметра
  readonly id = toSignal(
    this.route.paramMap.pipe(
      map(p => {
        const idParam = p.get('id');
        const id = idParam !== null ? +idParam : null;
        return id;
      })
    ),
    { initialValue: null }
  );
  // --- Select price from store ---
  readonly selectedPriceSignal = signal<Price | null>(null);

  readonly priceEffect = effect(() => {
    const idValue = this.id();
    if (idValue !== null) {
      this.store.select(selectPriceById(idValue)).subscribe(price => {
        this.selectedPriceSignal.set(price);
        if (this.productIDSignal() !== price?.product_id && price?.product_id !== undefined) {
          this.productIDSignal.set(price?.product_id ?? -1);
        }
        this.form.patchValue({
          value: price?.value ? Number(price.value) : 0,
          valid_from: price?.valid_from ? new Date(price.valid_from) : new Date(),
          valid_to: price?.valid_to ? new Date(price.valid_to) : null,
          is_active: price?.is_active ?? true,
          description: price?.description ?? ''
        });
      });
   }
  });

  // // --- Визначення режиму
  readonly isEdit = computed(() => this.id() !== null && this.selectedPriceSignal() !== null);

  // --- Error from store ---
  readonly error = this.store.selectSignal(selectError);

  constructor() {
    // Встановлюємо ID продукту з query параметрів
    if (this.productId()) {
      this.productIDSignal.set(this.productId());
    }

    // Визначаємо джерело переходу на основі параметрів URL

    // Перевіряємо, чи є в URL параметр product
    if (this.productId()) {
      // Якщо є параметр product, зберігаємо URL деталей продукту
      this.sourceUrl.set(`/product-details/${this.productId()}`);
    } else {
      // Якщо немає параметра product, вважаємо, що прийшли зі сторінки цін
      this.sourceUrl.set('/price');
    }

    // Load price details when price ID changes
    effect(() => {
      const idValue = this.id();
      const currentPrice = this.selectedPriceSignal();

      if (idValue === null || currentPrice?.id === idValue)
        return;

      this.store.dispatch(PriceActions.details({ id: idValue }));
    });

    // Load product details when product ID changes
    effect(() => {
      const productId = this.productIDSignal();
      if (productId === null) return;

      this.store.dispatch(ProductActions.details({ id: productId }));

      // Subscribe to the product in the store
      this.store.select(selectProductById(productId)).subscribe(product => {
        this.productSignal.set(product);
      });
    });
  }

  getProductTitle(): string {
    const product = this.productSignal();
    return product ? product.title : '';
  }

  onSubmit(): void {

    if (this.form.invalid) return;

    const formValue = this.form.value;
    const productId = this.productIDSignal();
    console.log('onSubmit, productId: ', productId);
    if (!productId) return;

    const value = {
      product: productId,
      value: formValue.value ?? 0,
      valid_from: formValue.valid_from?.toISOString() ?? '',
      valid_to: formValue.valid_to?.toISOString() ?? null,
      is_active: formValue.is_active ?? false,
      description: formValue.description ?? ''
    };
    const action = this.isEdit()
      ? PriceActions.update({ id: this.id()!, changes: value })
      : PriceActions.create({ price: value });

    const successType = this.isEdit()
      ? PriceActions.updateSuccess
      : PriceActions.createSuccess;

    this.actions$.pipe(
      ofType(successType),
      take(1)
    ).subscribe(() => this.onBack());

    this.store.dispatch(action);
  }

  onBack(): void {
    this.store.dispatch(PriceActions.resetError());

    // Створюємо об'єкт QueryParams з усіма необхідними параметрами
    const queryParams: QueryParams = {
      ...this.queryParams(),
      sourceUrl: this.sourceUrl() || undefined
    };

    this.store.dispatch(PriceActions.back({ queryParams }));
  }
}
