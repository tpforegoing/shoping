import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Price } from '../price.model';
import { PriceListTableComponent } from '../price-list-table/price-list-table.component';
import { PriceListCardComponent } from '../price-list-card/price-list-card.component';

@Component({
  selector: 'app-price-list-main',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    PriceListTableComponent,
    PriceListCardComponent
  ],
  templateUrl: './price-list-main.component.html',
  styleUrl: './price-list-main.component.scss'
})
export class PriceListMainComponent {
  @Input() prices: Price[] = [];
  @Input() isMobile = false;
  @Input() filter = '';
  @Input() loading = false;
  
  @Output() edit = new EventEmitter<Price>();
  @Output() delete = new EventEmitter<Price>();

  getProductTitle(price: Price): string {
    if (typeof price.product === 'object' && price.product !== null) {
      return price.product.title || '';
    }
    return String(price.product || '');
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  onEdit(price: Price) {
    this.edit.emit(price);
  }

  onDelete(price: Price) {
    this.delete.emit(price);
  }
}
