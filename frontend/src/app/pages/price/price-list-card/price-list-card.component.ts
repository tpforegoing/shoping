import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Price } from '../price.model';
import { HighlightPipe } from '../../../share/highlight.pipe';

@Component({
  selector: 'app-price-list-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    HighlightPipe,
  ],
  templateUrl: './price-list-card.component.html',
  styleUrl: './price-list-card.component.scss'
})
export class PriceListCardComponent {
  @Input() prices: Price[] = [];
  @Input() filter = '';
  
  @Output() edit = new EventEmitter<Price>();
  @Output() delete = new EventEmitter<Price>();

  getProductTitle(price: Price): string {
    if (typeof price.product === 'object' && price.product !== null) {
      return price.product.title || '';
    }
    return String(price.product || '');
  }

  formatDate(date: string): string {
    return date ? new Date(date).toLocaleDateString() : '';
  }

  onEdit(price: Price): void {
    this.edit.emit(price);
  }

  onDelete(price: Price): void {
    this.delete.emit(price);
  }
}
