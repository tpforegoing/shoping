import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CommonModule, NgIf, AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatError } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { AuthActions } from '../../store/auth.actions';
import { selectError, selectLoading } from '../../store/auth.selectors';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatError,
    MatLabel,
    NgIf,
    AsyncPipe
  ]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);

  onSubmit(): void {
    if (this.form.valid) {
      const username: string = this.form.get('username')!.value!;
      const password: string = this.form.get('password')!.value!;
      this.store.dispatch(AuthActions.loginStart({ username, password }));
    }
  }
}
