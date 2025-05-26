import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../clients.service';
import { Customer } from '../clients.model';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';
import { QueryParams } from '../../../store/store.model';
import { selectCustomerById, selectCustomerError, selectCustomerLoading } from '../store/client.selectors';
import { CustomerActions } from '../store/client.actions';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss'
})
export class ClientDetailComponent {
  private customerService = inject(CustomerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private store = inject(Store);


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
  readonly loading = this.store.selectSignal(selectCustomerLoading);
  readonly error = this.store.selectSignal(selectCustomerError);
  

  constructor() {
    effect(() => {
      const idValue = this.id();
      if (idValue !== null) {
        this.store.dispatch(CustomerActions.details({ id: idValue }));
      }
    });
  }


  onEdit(): void {
    const id = this.customer()?.id;
    const sourceUrl = this.route.snapshot.queryParamMap.get('sourceUrl') || '/clients';

    if (id) {
      this.router.navigate(['/clients/edit', id], {
        relativeTo: this.route,
        queryParams: { sourceUrl }
      });
    }
  }

  onBack(): void {
    const backUrl = this.sourceUrl();
    this.router.navigateByUrl(backUrl);
  }
}
