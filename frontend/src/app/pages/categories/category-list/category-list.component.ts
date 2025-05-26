import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, inject, signal, effect } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Store } from '@ngrx/store';

import { CategoryActions } from '../store/category.actions';
import { selectAllCategories, selectLoading, selectPagination } from '../store/category.selectors';
import { CategoryFull } from '../categories.model';

import { CategoryListFooterComponent } from '../category-list-footer/category-list-footer.component';
import { CategoryListMainComponent } from '../category-list-main/category-list-main.component';
import { CategoryListHeaderComponent } from '../category-list-header/category-list-header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../dialog/delete-dialog/delete-dialog.component';


@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    CategoryListHeaderComponent,
    CategoryListMainComponent,
    CategoryListFooterComponent,
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent {
  private store = inject(Store);
  private bp = inject(BreakpointObserver);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  
  isMobile = signal<boolean>(window.innerWidth < 800);
  @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
  this.isMobile.set(window.innerWidth < 800);
}

  readonly filter = signal('');
  readonly page = signal (1)
  // readonly allCategories: Category[] = ELEMENT_DATA;
  readonly allCategories = this.store.selectSignal(selectAllCategories);

  readonly loading = this.store.selectSignal(selectLoading);
  readonly pagination = this.store.selectSignal(selectPagination);

  readonly categories = this.allCategories;

  readonly total = computed(() => this.pagination().count);
  constructor(private dialog: MatDialog) {
    // перше завантаження
    this.store.dispatch(CategoryActions.load({ page: 1 }));
    this.bp.observe([Breakpoints.Handset])
      .subscribe(result => this.isMobile.set(result.matches));

    effect(() => {
      this.store.dispatch(CategoryActions.load({ page: this.page(), filter: this.filter() }));
    });
    
    this.route.queryParams.subscribe(params => {
      const page = +params['page'] || 1;
      const filter = params['filter'] || '';
      this.page.set(page);
      this.filter.set(filter);
      this.store.dispatch(CategoryActions.load({ page, filter }));
    });
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

  onLoadMore() {
    const next = this.pagination().next;
    if (next) {
      const nextPage = new URL(next).searchParams.get('page');
      this.store.dispatch(CategoryActions.load({ page: Number(nextPage), filter: this.filter() }));
    }
  }
  onAdd() {
    this.navigateWithParams(['add'], this.page(), this.filter());
  }
  onEdit(category: CategoryFull) {
    // console.log('[LIST component]: click');
    this.navigateWithParams(['edit', category.id], this.page(), this.filter());
  }
  
  onDelete(category: CategoryFull) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, { data: { formTitle: 'категорію', title: category.title } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(CategoryActions.delete({ id: category.id }));
      }
    });
  }
}

