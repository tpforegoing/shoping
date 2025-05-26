import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Order } from '../orders.model';
import { HighlightPipe } from '../../../share/highlight.pipe';


@Component({
  selector: 'app-orders-card-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    HighlightPipe
  ],
  templateUrl: './orders-card-list.component.html',
  styleUrl: './orders-card-list.component.scss'
})
export class OrdersCardListComponent {
  @Input() orders: Order[] = [];
  @Input() filter = '';
  @Input() isMobile = false;
  @Output() view = new EventEmitter<Order>();
  @Output() edit = new EventEmitter<Order>();
  @Output() delete = new EventEmitter<Order>();
  @Output() loadMore = new EventEmitter<void>();
  @Output() loadPrevious = new EventEmitter<void>();

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  handleScroll(): void {
    const element = this.scrollContainer.nativeElement;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 200;
    const atTop = element.scrollTop <= 200;

    if (atBottom) {
      this.loadMore.emit();
    } else if (atTop) {
      this.loadPrevious.emit();
    }
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
      case 'draft': return 'status-draft';
      case 'submitted': return 'status-submitted';
      case 'paid': return 'status-paid';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }
  getNumberToString(number: number): string {
    return number.toString();
  }
}
