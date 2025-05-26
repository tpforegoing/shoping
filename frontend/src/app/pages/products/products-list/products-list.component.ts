import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, inject, signal, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductsFooterComponent } from '../products-footer/products-footer.component';
import { ProductsListMainComponent } from '../products-list-main/products-list-main.component';
import { ProductsHeaderComponent } from '../products-header/products-header.component';

import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DeleteDialogComponent } from '../../../dialog/delete-dialog/delete-dialog.component';

import { selectLoading, selectPagination, selectProducts } from '../store/product.selectors';
import { Product } from '../products.model';
import { ProductActions } from '../store/product.actions';
import { CartActions } from '../../orders/store/cart.actions';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductsHeaderComponent,
    ProductsListMainComponent,
    ProductsFooterComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {
  private store = inject(Store);
  private bp = inject(BreakpointObserver);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly products_all = this.store.selectSignal(selectProducts);
  readonly filter = signal('');
  readonly page = signal(1);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly pagination = this.store.selectSignal(selectPagination);
  readonly total = computed(() => this.pagination().count);

  isMobile = signal<boolean>(window.innerWidth < 800);
  isLoadingMore = signal<boolean>(false);

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile.set(window.innerWidth < 960);
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const page = +params['page'] || 1;
      const filter = params['filter'] || '';
      // console.log('get params:', page, filter, 'params:', params);
      this.page.set(page);
      this.filter.set(filter);
      this.store.dispatch(ProductActions.load({ params: { page, filter } }));
    });
  }

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {
    // підписатися на перевірку моб./дестоп
    this.bp.observe([Breakpoints.Handset])
      .subscribe(result => this.isMobile.set(result.matches));
  }

  onLoadMore(): void {
    const next = this.pagination().next;
    if (next && !this.isLoadingMore()) {
      this.isLoadingMore.set(true);
      const nextPage = Number(new URL(next).searchParams.get('page'));
      this.store.dispatch(ProductActions.loadMore({
        params: {
          page: nextPage,
          filter: this.filter(),
        }
      }));
      // Скидаємо прапорець завантаження після затримки
      setTimeout(() => this.isLoadingMore.set(false), 1000);
    }
  }

  onLoadMorePrevious(): void {
    // console.log('onLoadMorePrevious start');
    const previous = this.pagination().previous;
    if (previous && !this.isLoadingMore()) {
      // console.log('onLoadMorePrevious previous:', previous);
      this.isLoadingMore.set(true);
      const prevPage = Number(new URL(previous).searchParams.get('page'));
      this.store.dispatch(ProductActions.loadMore({
        params: {
          page: prevPage,
          filter: this.filter(),
        }
      }));
    }
  }
  private navigateWithParams(nav: any[], page: number, filter: string) {
    const queryParams: any = {};
    if (page !== 1) queryParams['page'] = page;
    if (filter.trim()) queryParams['filter'] = filter;
    this.router.navigate(nav, {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: Object.keys(queryParams).length ? 'merge' : undefined,
    });
  }

   onFilterChanged(value: string) {
     this.filter.set(value);
     this.navigateWithParams([], 1, value);
   }

   onPageChange(pageIndex: number) {
     const page = pageIndex + 1; // конвертуємо до 1-based
     this.page.set(page);
     this.navigateWithParams([], page, this.filter());
   }

   onLoadNext() {
    const next = this.pagination().next;
    if (next) {
      const nextPage = Number(new URL(next).searchParams.get('page'));
      this.store.dispatch(ProductActions.loadMore({
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

   onView(product: Product) {
     this.navigateWithParams(['/product-details', product.id], this.page(), this.filter());
   }

   onEdit(product: Product) {
     this.navigateWithParams(['edit', product.id], this.page(), this.filter());
   }

   onDelete(product: Product) {
     const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { formTitle: 'продукт', title: product.title }
    });

     dialogRef.afterClosed().subscribe(result => {
       if (result) {
         this.store.dispatch(ProductActions.delete({ id: product.id }));
       }
     });
   }
   onAddToCart(product: Product) {
     // Додаємо товар до кошика
     this.store.dispatch(CartActions.addItem({ product, quantity: 1 }));
     this.snackBar.open(`Товар "${product.title}" додано до кошика`, 'Закрити', {
       duration: 3000
     });
   }
}
