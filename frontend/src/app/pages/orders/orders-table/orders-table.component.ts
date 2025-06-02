import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Order } from '../orders.model';
import { HighlightPipe } from '../../../share/highlight.pipe';


@Component({
  selector: 'app-orders-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    HighlightPipe,
  ],
  templateUrl: './orders-table.component.html',
  styleUrl: './orders-table.component.scss'
})
export class OrdersTableComponent {
  @Input() orders: Order[] = [];
  @Input() filter = '';
  @Output() view = new EventEmitter<Order>();
  @Output() edit = new EventEmitter<Order>();
  @Output() delete = new EventEmitter<Order>();

  displayedColumns: string[] = ['id', 'customer', 'status', 'total_price', 'updated', 'actions'];

  isEditable(item: Order): boolean {
    return !['paid'].includes(item.status);
  }
  
  onView(order: Order): void {
    this.view.emit(order);
  }

  onEdit(order: Order): void {
    this.edit.emit(order);
  }

  onDelete(order: Order): void {
    this.delete.emit(order);
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'draft': return 'Чернетка';
      case 'submitted': return 'Очікує оплату';
      case 'paid': return 'Оплачено';
      case 'cancelled': return 'Скасовано';
      default: return status;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'draft': return 'text-secondary';
      case 'submitted': return 'text-primary';
      case 'paid': return 'text-success';
      case 'cancelled': return 'text-danger';
      default: return '';
    }
  }
}
