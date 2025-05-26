import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, OnChanges, SimpleChanges, inject } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Product } from '../products.model';
import { HighlightPipe } from '../../../share/highlight.pipe';


@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    HighlightPipe,
    MatMenuModule,
    MatButtonModule,
    MatSortModule,
  ],
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss'
})
export class ProductsTableComponent implements OnChanges {


  @Input() products: Product[] = [];
  @Input() filter = '';

  @Output() view = new EventEmitter<Product>();
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();
  @Output() addToCart = new EventEmitter<Product>();

  displayedColumns: string[] = ['icon', 'title', 'category', 'description', 'price', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);

  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products']) {
      this.dataSource.data = this.products;
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
        case 'category':
          return this.getCategoryLabel(item);
        // case 'price':
        //   return item.current_price?.value || 0;
        default:
          return (item as any)[property];
      }
    };
  }

  onView(product: Product) {
    this.view.emit(product);
  }

  onEdit(product: Product) {
    this.edit.emit(product);
  }

  onDelete(product: Product) {
    this.delete.emit(product);
  }

  onAddToCart(product: Product) {
    // Також емітимо подію для батьківського компонента
    this.addToCart.emit(product);
  }

  getCategoryLabel(prod: Product): string {
    if (typeof prod.category === 'object' && prod.category !== null) {
      return prod.category.full_title;
    }
    return String(prod.category || ''); // або '' якщо треба глушити числа
  }

  getCategoryIcon(prod: Product): string {
    if (typeof prod.category === 'object' && prod.category !== null) {
      return prod.category.icon ?? '';
    }
    return ''; // або '' якщо треба глушити числа
  }
}
