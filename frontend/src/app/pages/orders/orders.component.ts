import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, signal,  computed, effect } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { Store } from '@ngrx/store';

import { MatDialog } from '@angular/material/dialog';

import { OrdersHeaderComponent } from './orders-header/orders-header.component';
import { OrdersListMainComponent } from './orders-list-main/orders-list-main.component';
import { OrdersFooterComponent } from './orders-footer/orders-footer.component';
import { DeleteDialogComponent } from '../../dialog/delete-dialog/delete-dialog.component';

import { Order } from './orders.model';
import { LoadParams, MANAGER, QueryParams } from '../../store/store.model';
import { OrdersActions } from './store/orders/orders.actions';
import { selectOrders, selectLoading, selectPagination, selectOrdersCount } from './store/orders/orders.selectors';
import { selectUser } from '../../auth/store/auth.selectors';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    OrdersHeaderComponent,
    OrdersListMainComponent,
    OrdersFooterComponent
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent  {
  private store = inject(Store);
  private bp = inject(BreakpointObserver);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  //signals from NgRx
  readonly user = this.store.selectSignal(selectUser); 
  readonly orders = this.store.selectSignal(selectOrders);
  readonly total = this.store.selectSignal(selectOrdersCount);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly pagination = this.store.selectSignal(selectPagination);

  // queryParams signal
  private queryParams = toSignal(this.route.queryParams, { initialValue: {} });
  readonly query = computed((): LoadParams => {
    const raw = this.queryParams() as Params;
    return {
      page: +(raw['page'] || 1),
      filter: raw['filter'] || '',
      ordering: raw['ordering'] || '',
    };
  });
  

  isMobile = signal<boolean>(window.innerWidth < 800);
  isLoadingMore = signal<boolean>(false);

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile.set(window.innerWidth < 960);
  }

  constructor() {
    // завантажити данні згідно урл
    effect(() => {
      this.store.dispatch(
        OrdersActions.load({params: this.query()})
      )
    })
    // підписатися на перевірку моб./дестоп
    this.bp.observe([Breakpoints.Handset])
      .subscribe(result => this.isMobile.set(result.matches));
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

  isAddable(): boolean {
    const user = this.user();
    return user !== null && user.role === MANAGER;
  }
  onFilterChanged(filter: string): void {
    this.navigateWithParams([], {page: 1, filter: filter});
  }

  onPageChange(page: number): void {
    this.navigateWithParams([], {page: page, filter: this.query().filter});
  }

  onLoadMore(): void {

  }

  onLoadMorePrevious(): void {
    const next = this.pagination().next;
    if (next === null) { 
      this.isLoadingMore.set(false);
      return;
    }

    if (next && this.isLoadingMore()){
      this.isLoadingMore.set(true);
      const nextPage = Number(new URL(next).searchParams.get('page'));
      this.store.dispatch(OrdersActions.loadMore({
              params: {
                page: nextPage,
              }
      }));
    }
  }

  onLoadNext(): void {

  }

  onAdd(): void {
    this.navigateWithParams(['add'], {}, this.router.url);
  }

  onView(order: Order): void {
    this.navigateWithParams(['detail', order.id], {}, this.router.url);
  }

  onEdit(order: Order): void {
    console.log('[onEdit]');
    this.navigateWithParams(['edit', order.id], {}, this.router.url);
  }

  onDelete(order: Order): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        title: 'Видалення замовлення',
        message: `Ви впевнені, що хочете видалити замовлення #${order.id}?`
      }
    });
    dialogRef.afterClosed()
      .pipe(filter(Boolean))
      .subscribe(()=>{
        this.store.dispatch( OrdersActions.delete({ id: order.id}))
    })

  }

}
