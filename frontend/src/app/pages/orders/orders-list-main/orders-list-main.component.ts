import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Order } from '../orders.model';
import { OrdersTableComponent } from '../orders-table/orders-table.component';
import { OrdersCardListComponent } from '../orders-card-list/orders-card-list.component';

@Component({
  selector: 'app-orders-list-main',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    OrdersTableComponent,
    OrdersCardListComponent
  ],
  templateUrl: './orders-list-main.component.html',
  styleUrl: './orders-list-main.component.scss'
})
export class OrdersListMainComponent {
  @Input() orders: Order[] = [];
  @Input() filter = '';
  @Input() loading = false;
  @Input() isMobile = false;
  @Output() view = new EventEmitter<Order>();
  @Output() edit = new EventEmitter<Order>();
  @Output() delete = new EventEmitter<Order>();
  @Output() loadMore = new EventEmitter<void>();
  @Output() loadPrevious = new EventEmitter<void>();

  onView(order: Order): void {
    this.view.emit(order);
  }

  onEdit(order: Order): void {
    this.edit.emit(order);
  }

  onDelete(order: Order): void {
    this.delete.emit(order);
  }

  onLoadMore(): void {
    this.loadMore.emit();
  }

  onLoadPrevious(): void {
    this.loadPrevious.emit();
  }
}
