import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ACTION_CREATE, ACTION_UPDATE } from '../../../store/store.model';
import { selectAllCategories } from '../../categories/store/category.selectors';
import { CategoryActions } from '../../categories/store/category.actions';
import { selectError, selectProductById } from '../store/product.selectors';
import { Product, ProductSubmit } from '../products.model';
import { ProductActions } from '../store/product.actions';
import { take } from 'rxjs';
import { CategoryFull } from '../../categories/categories.model';


@Component({
  selector: 'app-product-add-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,

  ],
  templateUrl: './product-add-edit.component.html',
  styleUrl: './product-add-edit.component.scss'
})
export class ProductAddEditComponent {
  readonly ACTION_CREATE = ACTION_CREATE;
  readonly ACTION_UPDATE = ACTION_UPDATE;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private readonly actions$ = inject(Actions);
  queryParams = this.route.snapshot.queryParams;
  

  id = signal<number | null>(null);
  selectedProduct = signal<Product | null>(null);
  allCategories = toSignal(this.store.select(selectAllCategories), { initialValue: [] });
  readonly error = this.store.selectSignal(selectError);

  form = this.fb.group({
    title: this.fb.control<string>('', {
      validators: [Validators.required, Validators.minLength(3)]
    }),
    category: this.fb.control<number | null>(null),
    description: this.fb.control<string | null>(''),
  });
  // Визначаємо чи редагування
  isEdit = computed(() => this.id() !== null && this.selectedProduct() !== null);
  constructor() {
    this.store.dispatch(CategoryActions.loadAll({ page: 1}));
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;

      this.id.set(id);

       // Завантажуємо продукт відразу з бекенда
      this.store.dispatch(ProductActions.details({ id }));
      // Слухаємо результат напряму зі store
      const product$ = this.store.select(selectProductById(id));
      const productSignal = toSignal(product$,{initialValue: null});
      effect(() => {
        const prod = productSignal();
        if (prod) {
          this.selectedProduct.set(prod);
          this.form.patchValue({
            title: prod.title,
            // Перевіряємо, чи category є об'єктом, і якщо так, беремо його id
            category: typeof prod.category === 'object' && prod.category !== null ? prod.category.id : prod.category,
            description: prod.description
          });
        }
      });
    }
  }

    onSubmit(): void {
      if (this.form.invalid) return;

      const value: ProductSubmit = {
        title: this.form.value.title!,
        description: this.form.value.description ?? '',
        category: this.form.value.category ?? null
      };
      
      console.log('save value: ', value);
      const action = this.isEdit() && this.id()
        ? ProductActions.update({ id: this.id()!, changes: value })
        : ProductActions.create({ product: value });
  
      const successType = this.isEdit()
        ? ProductActions.updateSuccess
        : ProductActions.createSuccess;
  
      this.actions$.pipe(
        ofType(successType),
        take(1)
      ).subscribe(() => this.onBack());
  
      this.store.dispatch(action);
    }

    onBack(): void {
      this.store.dispatch(ProductActions.resetError());
      this.store.dispatch(ProductActions.back({ queryParams: this.queryParams }));
    }
}
