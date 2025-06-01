import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, signal, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { MatDialog } from '@angular/material/dialog';

import { ClientsHeaderComponent } from './clients-header/clients-header.component';
import { ClientsListMainComponent } from './clients-list-main/clients-list-main.component';
import { ClientsFooterComponent } from './clients-footer/clients-footer.component';
import { DeleteDialogComponent } from '../../dialog/delete-dialog/delete-dialog.component';
import { selectCustomers, selectCustomersCount, selectLoading, selectPagination } from './store/client.selectors';
import { LoadParams, QueryParams } from '../../store/store.model';
import { CustomerService } from './clients.service';
import { Customer } from './clients.model';
import { CustomerActions } from './store/client.actions';
import { filter } from 'rxjs';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    ClientsHeaderComponent,
    ClientsListMainComponent,
    ClientsFooterComponent
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  // private customerService = inject(CustomerService);
  private store = inject(Store);
  private bp = inject(BreakpointObserver);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  // Signals from NgRx Store
  readonly customers = this.store.selectSignal(selectCustomers)
  readonly total = this.store.selectSignal(selectCustomersCount);
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
    effect(()=>{
      this.store.dispatch(
        CustomerActions.load({params: this.query()})
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
  onFilterChanged(filter: string): void {
    this.navigateWithParams([], {page: 1, filter: filter});
  }

  onPageChange(page: number): void {
    this.navigateWithParams([], {page: page, filter: this.query().filter});
  }

  onLoadMore(): void {
    const next = this.pagination().next;
    if (next === null) { 
      this.isLoadingMore.set(false);
      return;
    }

    if (next && this.isLoadingMore()){
      this.isLoadingMore.set(true);
      const nextPage = Number(new URL(next).searchParams.get('page'));
      this.store.dispatch(CustomerActions.loadMore({
              params: {
                page: nextPage,
              }
      }));
    }
  }

  onLoadMorePrevious(): void {

  }

  onAdd(): void {
    this.navigateWithParams(['add'], {}, this.router.url);
  }

  onView(customer: Customer): void {
    this.navigateWithParams(['detail', customer.id], {}, this.router.url);
  }

  onEdit(customer: Customer): void {
    this.navigateWithParams(['edit', customer.id], {}, this.router.url);
  }

  onDelete(customer: Customer): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        title: 'Видалення клієнта',
        message: `Ви впевнені, що хочете видалити клієнта "${customer.name}"?`
      }
    });

    dialogRef.afterClosed()
      .pipe(filter(Boolean))
      .subscribe(()=>{
        this.store.dispatch(CustomerActions.delete({ id: customer.id}))
      })
  }

}
