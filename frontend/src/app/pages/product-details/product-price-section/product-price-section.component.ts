import { Component, Input, OnInit, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';

import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';

import { PriceHeaderComponent } from '../../price/price-header/price-header.component';
import { PriceListTableComponent } from '../../price/price-list-table/price-list-table.component';
import { PriceListCardComponent } from '../../price/price-list-card/price-list-card.component';
import { PriceFooterComponent } from '../../price/price-footer/price-footer.component';

import { Price } from '../../price/price.model';
import { QueryParams } from '../../../store/store.model';
import { selectPricesForCurrentProduct,
        selectLoading,
        selectIsActiveFilter,
        selectPriceCount,
        selectPagination,
        selectCurrentProductId} from '../../price/store/price.selectors';
import { PriceActions } from '../../price/store/price.actions';
import { filter, map } from 'rxjs';
import { DeleteDialogComponent } from '../../../dialog/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-product-price-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    PriceHeaderComponent,
    PriceListTableComponent,
    PriceListCardComponent,
    PriceFooterComponent
  ],
  templateUrl: './product-price-section.component.html',
  styleUrls: ['./product-price-section.component.scss']
})
export class ProductPriceSectionComponent {
  @Input() productId: number = 0;
  // inject
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private bp = inject(BreakpointObserver);
  private dialog: MatDialog = inject(MatDialog);
  // Signals from NgRx Stroe
  readonly prices = this.store.selectSignal(selectPricesForCurrentProduct);
  readonly total = this.store.selectSignal(selectPriceCount);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly pagination = this.store.selectSignal(selectPagination);
  readonly isActiveFilter = this.store.selectSignal(selectIsActiveFilter);
  // UI signals
  private queryParams = toSignal(this.route.queryParams, { initialValue: {} });
  isLoadingMore = signal<boolean>(false);

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
      PriceActions.loadForProduct({
        productId: this.productId,
        params: {
          page: this.page(),
          filter: this.filter(),
          isActive: this.isActive(),
        }
      })
    );
  });

  // реактивне стеження
  readonly isMobile = toSignal(
    this.bp.observe([Breakpoints.Handset]).pipe(
      // перетворимо result на булеве значення
      map(result => result.matches)
    ),
    { initialValue: window.innerWidth < 960 } // початкове значення
  );

  onFilterChanged(filter: string): void {
    this.navigateWithParams([], 1, filter);
  }

  onPageChanged(pageIndex: number): void {
    const page = pageIndex + 1; // конвертуємо до 1-based
    this.navigateWithParams([], page, this.filter());
  }

  onLoadMore() {
    const next = this.pagination().next;
    if (next && !this.isLoadingMore()) {
      this.isLoadingMore.set(true);
      const nextPage = Number(new URL(next).searchParams.get('page'));
      this.store.dispatch(PriceActions.loadMore({
        params: {
          page: nextPage,
          filter: this.filter(),
          isActive: this.isActive(),
        }
      }));
      // Скидаємо прапорець завантаження після затримки
      setTimeout(() => this.isLoadingMore.set(false), 1000);
    }
  }

  onAdd() {
   this.navigateWithParams(['/price','add'], this.page(), this.filter(),this.isActive(), this.productId);
  }

  onEdit(price: Price) {
    this.navigateWithParams(['/price','edit', price.id], this.page(), this.filter(),this.isActive(),this.productId);
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

  private navigateWithParams(commands: any[], page: number, filter?: string,
                            isActive?: boolean | null, productId?: number): void {
    // Створюємо об'єкт QueryParams
    const queryParams: QueryParams = {
      ...(page !== 1 && { page }),
      ...(filter?.trim() && { filter }),
      ...((isActive ?? null) !== null && { is_active: isActive!.toString() }),
      ...((productId ?? null) !== null && { product: productId }),
      // Додаємо sourceUrl для повернення на сторінку деталей продукту
      sourceUrl: `/product-details/${this.productId}`
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




