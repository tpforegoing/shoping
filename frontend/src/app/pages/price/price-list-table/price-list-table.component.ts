import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Price } from '../price.model';
import { HighlightPipe } from '../../../share/highlight.pipe';

@Component({
  selector: 'app-price-list-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSortModule,
    HighlightPipe
  ],
  templateUrl: './price-list-table.component.html',
  styleUrls: ['./price-list-table.component.scss']
})
export class PriceListTableComponent {
  @Input() prices: Price[] = [];
  @Input() filter = '';

  @Output() edit = new EventEmitter<Price>();
  @Output() delete = new EventEmitter<Price>();

  displayedColumns: string[] = ['product', 'value', 'valid_from', 'valid_to', 'is_active', 'description', 'actions'];
  dataSource = new MatTableDataSource<Price>([]);

  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(): void {
    if (this.prices) {
      this.dataSource.data = this.prices;
    }

    if (this.sort && !this.dataSource.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    // Налаштування функцій сортування для складних полів
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'product':
          return this.getProductTitle(item);
        case 'valid_from':
        case 'valid_to':
          return item[property] ? new Date(item[property]).getTime() : 0;
        default:
          return (item as any)[property];
      }
    };
  }

  onEdit(price: Price) {
    this.edit.emit(price);
  }

  onDelete(price: Price) {
    this.delete.emit(price);
  }

  getProductTitle(price: Price): string {
    if (typeof price.product === 'object' && price.product !== null) {
      return price.product.title;
    }
    return String(price.product || '');
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '-';
      const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';

    return date.toLocaleString('uk-UA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}
