import { Component, computed, effect, HostListener,  inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { MatDialog } from '@angular/material/dialog';


import { PriceActions } from './store/price.actions';
import { selectPrices, selectPriceCount,
  selectLoading, selectPagination, selectIsActiveFilter } from './store/price.selectors';
import { Price } from './price.model';
import { QueryParams } from '../../store/store.model';
import { PriceHeaderComponent } from './price-header/price-header.component';
import { PriceListMainComponent } from './price-list-main/price-list-main.component';
import { PriceFooterComponent } from './price-footer/price-footer.component';
import { DeleteDialogComponent } from './../../dialog/delete-dialog/delete-dialog.component';


@Component({
  selector: 'app-price',
  standalone: true,
  imports: [
    CommonModule,
    PriceHeaderComponent,
    PriceListMainComponent,
    PriceFooterComponent
  ],
  templateUrl: './price.component.html',
  styleUrl: './price.component.scss'
})
export class PriceComponent {
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private bp = inject(BreakpointObserver);

  // Signals from NgRx Stroe
  readonly prices = this.store.selectSignal(selectPrices);
  readonly total = this.store.selectSignal(selectPriceCount);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly pagination = this.store.selectSignal(selectPagination);
  readonly isActiveFilter = this.store.selectSignal(selectIsActiveFilter);
  // UI signals
  isMobile = signal<boolean>(window.innerWidth < 960);
  isLoadingMore = signal<boolean>(true);

  // queryParams signal
  private queryParams = toSignal(this.route.queryParams, { initialValue: {} });
   // Parsed URL params as signals
  readonly page = computed(() => +(this.queryParams() as Params)['page'] || 1);
  readonly filter = computed(() => (this.queryParams() as Params)['filter'] || '');
  readonly isActive = computed(() => {
    const param = (this.queryParams() as Params)['is_active'];
    return param === undefined ? undefined : param === 'true';
  });

  // Effect that triggers PriceActions.load when queryParams change
  private readonly loadPricesEffect = effect(() => {
    this.store.dispatch(
      PriceActions.load({
        params: {
          page: this.page(),
          filter: this.filter(),
          isActive: this.isActive(),
        }
      })
    );
  });

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile.set(window.innerWidth < 960);
  }

  constructor(private dialog: MatDialog) {
    // підписатися на перевірку моб./дестоп
    // Підписка на зміни розміру екрану
    this.bp.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile.set(result.matches);
      });

  }

  onFilterChanged(filter: string): void {
    this.navigateWithParams([], 1, filter);
  }

  onPageChange(pageIndex: number): void {
    const page = pageIndex + 1; // конвертуємо до 1-based
    this.navigateWithParams([], page, this.filter());
  }

  onLoadMore() {
    const next = this.pagination().next;
    console.log('onLoadMore next:', next);
    if (next === null) { 
      this.isLoadingMore.set(false);
      return;
    }
    console.log('onLoadMore isLoadingMore:', this.isLoadingMore());
    if (next && this.isLoadingMore()) {
      this.isLoadingMore.set(true);
      const nextPage = Number(new URL(next).searchParams.get('page'));
      this.store.dispatch(PriceActions.loadMore({
        params: {
          page: nextPage,
          filter: this.filter(),
        }
      }));
    } 
  }

  onAdd() {
   this.navigateWithParams(['add'], this.page(), this.filter());
  }

  onEdit(price: Price) {
    this.navigateWithParams(['edit', price.id], this.page(), this.filter());
  }

  onDelete(price: Price) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        title: 'Видалення ціни',
        message: `Ви впевнені, що хочете видалити ціну "${price.value}" для продукту "${this.getProductTitle(price)}"?`
      }
    });

    dialogRef.afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.store.dispatch(PriceActions.delete({ id: price.id }));
      });
  }

  onIsActiveFilterChange(isActive: boolean | null): void {
    this.store.dispatch(PriceActions.setActiveFilter({ isActive }));
    this.navigateWithParams([], 1, this.filter(), isActive);
  }

  private navigateWithParams(commands: any[], page: number, filter?: string, isActive?: boolean | null): void {
    // Створюємо об'єкт QueryParams
    const queryParams: QueryParams = {
      ...(page !== 1 && { page }),
      ...(filter?.trim() && { filter }),
      ...((isActive ?? null) !== null && { is_active: isActive!.toString() }),
      // Додаємо sourceUrl для повернення на сторінку цін
      // sourceUrl: '/price'
    };

    this.router.navigate([...commands], {
      relativeTo: this.route,
      queryParams,
      // queryParamsHandling: 'merge'
    });
  }

  private getProductTitle(price: Price): string {
    if (typeof price.product === 'object' && price.product !== null) {
      return price.product.title;
    }
    return String(price.product || '');
  }

}

