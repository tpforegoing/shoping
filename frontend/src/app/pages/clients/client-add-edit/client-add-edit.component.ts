import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, } from '@angular/core';
import { map, Observable, take } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { selectCustomerLoading, selectCustomerError, selectCustomerById } from '../store/client.selectors';
import { CustomerActions } from '../store/client.actions';
import { QueryParams } from '../../../store/store.model';
import { Actions, ofType } from '@ngrx/effects';
import { CustomerSubmit } from '../clients.model';

@Component({
  selector: 'app-client-add-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './client-add-edit.component.html',
  styleUrl: './client-add-edit.component.scss'
})
export class ClientAddEditComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private store = inject(Store);
  private actions$ = inject(Actions);

  readonly queryParams = toSignal(this.route.queryParams as Observable<QueryParams>, {
    initialValue: { sourceUrl: ''},
  });
  //
  readonly sourceUrl = computed(() => this.queryParams()?.sourceUrl || '/');
  // --- ID з route параметра
  readonly id = toSignal(
    this.route.paramMap.pipe(map(p => +(p.get('id') || 0))),
    { initialValue: -1 }
  );
  readonly customer = this.store.selectSignal(selectCustomerById(this.id()));
  // --- Визначення режиму
  readonly isEditMode = computed(() => this.id() !== null && this.customer !== null);
  // --- Loading from store ---
  readonly loading = this.store.selectSignal(selectCustomerLoading);
  // --- Error from store ---
  readonly error = this.store.selectSignal(selectCustomerError);

  
  clientForm!: FormGroup;
  submitAttempted = false;

  constructor() {
    this.initForm();
    effect(() => {
      const idValue = this.id();
      if (idValue !== null) {
        this.store.dispatch(CustomerActions.details({ id: idValue }));
      }
    });
      // Автоматичне заповнення форми, коли дані завантажено
    effect(() => {
      const client = this.customer();
      if (client) {
        this.clientForm.patchValue({
          code: client.code,
          name: client.name,
          phone_no: client.phone_no,
        });
      }
    });
  }

  private initForm(): void {
    this.clientForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(12)]],
      name: ['', [Validators.required, Validators.maxLength(150)]],
      phone_no: ['', [Validators.maxLength(30)]]
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) return;

    const value: Partial<CustomerSubmit> = {
      code: this.clientForm.value.code!,
      name: this.clientForm.value.name!,
      phone_no: this.clientForm.value.phone_no ?? ''
    };

    const action = this.isEditMode()
      ? CustomerActions.update({ id: this.id()!, changes: value })
      : CustomerActions.create({ customer: value });

    const successType = this.isEditMode()
      ? CustomerActions.updateSuccess
      : CustomerActions.createSuccess;
    this.actions$.pipe(
      ofType(successType),
      take(1)
    ).subscribe({
        next: () => this.onBack(),
        error: (err) => {
          this.snackBar.open('Помилка завантаження даних клієнта', 'Закрити', {
            duration: 3000
        });
        } 
    });

    this.store.dispatch(action);
  }

  onBack(): void {
    const backUrl = this.sourceUrl();
    this.router.navigateByUrl(backUrl);
  }

  getErrorMessage(controlName: string): string {
    const control = this.clientForm.get(controlName);
    
    if (control?.hasError('required')) {
      return 'Це поле обов\'язкове';
    }
    
    if (control?.hasError('maxlength')) {
      const maxLength = control.getError('maxlength').requiredLength;
      return `Максимальна довжина ${maxLength} символів`;
    }
    
    return '';
  }
}
