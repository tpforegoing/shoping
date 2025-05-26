import { CommonModule } from '@angular/common';
import { Component, computed, effect, HostListener, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OrderService } from '../orders.service';
import { OrderItem } from '../orders.model';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { LoadParams, QueryParams } from '../../../store/store.model';
import { map, Observable } from 'rxjs';
import { selectError, selectLoading, selectParams, selectSelectedOrder } from '../store/orders/orders.selectors';
import { OrdersActions } from '../store/orders/orders.actions';
import { OrderDetailCardComponent } from './order-detail-card/order-detail-card.component';
import { OrderDetailItemsTableComponent } from './order-detail-items/order-detail-items-table/order-detail-items-table.component';

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

  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent  {
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private store = inject(Store);
  // Signals from NgRx Store
  readonly selectedOrder = this.store.selectSignal(selectSelectedOrder);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly error = this.store.selectSignal(selectError);
  readonly params = this.store.selectSignal(selectParams);
  
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
      // console.log('Завантаження товарів для замовлення ID:', idOrder);
      if (idOrder !== null) {
        this.store.dispatch(
          OrdersActions.loadWithItems({ id: idOrder})
        )
      }
    })
  }

  onEdit(): void {
    // if (this.order) {
    //   this.router.navigate(['../edit', this.order.id], { relativeTo: this.route });
    // }
  }

  onBack(): void {
    console.log('onBack');
    const backUrl = this.sourceUrl();
    this.router.navigateByUrl(backUrl);
  }

  onAddItem(): void {
    // if (this.order) {
    //   this.router.navigate(['../item/add', { order: this.order.id }], { relativeTo: this.route });
    // }
  }

  onEditItem(item: OrderItem): void {
    // if (this.order) {
    //   this.router.navigate(['../item/edit', item.id, { order: this.order.id }], { relativeTo: this.route });
    // }
  }

  onDeleteItem(item: OrderItem): void {
    // if (this.order) {
    //   this.orderService.deleteOrderItem(this.order.id, item.id).subscribe({
    //     next: () => {
    //       this.snackBar.open('Товар видалено з замовлення', 'Закрити', {
    //         duration: 3000
    //       });
    //       this.loadOrder(this.order!.id);
    //     },
    //     error: (error) => {
    //       console.error('Error deleting order item', error);
    //       this.snackBar.open('Помилка видалення товару з замовлення', 'Закрити', {
    //         duration: 3000
    //       });
    //     }
    //   });
    // }
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
