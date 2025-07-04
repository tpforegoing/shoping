import { CommonModule } from '@angular/common';
import { Component, computed, effect, HostListener, inject, signal } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { OrderItem } from '../orders.model';
import { LoadParams, QueryParams } from '../../../store/store.model';
import { selectError, selectLoading, selectParams, selectSelectedOrder } from '../store/orders/orders.selectors';
import { OrdersActions } from '../store/orders/orders.actions';
import { OrderDetailCardComponent } from './order-detail-card/order-detail-card.component';
import { OrderDetailItemsTableComponent } from './order-detail-items/order-detail-items-table/order-detail-items-table.component';
import { OrderDetailItemsCardComponent } from './order-detail-items/order-detail-items-card/order-detail-items-card.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    OrderDetailCardComponent,
    OrderDetailItemsTableComponent,
    OrderDetailItemsCardComponent,
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent  {
  // private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private store = inject(Store);
  // Signals from NgRx Store
  readonly selectedOrder = this.store.selectSignal(selectSelectedOrder);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly error = this.store.selectSignal(selectError);
  readonly params = this.store.selectSignal(selectParams);
  readonly isActionsEnabled=false;
  
  // queryParams signal
  readonly queryParams = toSignal(this.route.queryParams as Observable<QueryParams>, {
    initialValue: { sourceUrl: ''},
  });
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
  readonly id = toSignal(
    this.route.paramMap.pipe(map(p => +(p.get('id') || 0))),
    { initialValue: -1 }
  );

  isMobile = signal<boolean>(window.innerWidth < 800);
  @HostListener('window:resize', [])
  onResize() {
    this.isMobile.set(window.innerWidth < 960);
  }

  constructor() { 
    effect(() => {
      const idOrder = this.id();
      if (idOrder !== null) {
        this.store.dispatch(
          OrdersActions.loadWithItems({ id: idOrder})
        )
      }
    })
  }

  onEdit(): void {
    this.navigateWithParams(['/orders','edit', this.id()], this.query(), this.sourceUrl());
  }

  onBack(): void {
    const backUrl = this.sourceUrl();
    this.router.navigateByUrl(backUrl);
  } 

  onDeleteItem(item: OrderItem): void {

  }

  private navigateWithParams(commands: any[], params: LoadParams, sourceURL?: string): void {
    const queryParams: QueryParams = {
      ...(params.page && params.page !== 1 && { page: params.page }),
      ...(params.filter?.trim() && { filter: params.filter }),
      ...(params.ordering && { ordering: params.ordering }),
      ...((params.isActive ?? null) !== null && {
        is_active: params.isActive!.toString(),
      }),
      ...((sourceURL ?? null) !== null && {sourceUrl: sourceURL})
    };

    this.router.navigate([...commands], {
      relativeTo: this.route,
      queryParams,
    });
  }
}
