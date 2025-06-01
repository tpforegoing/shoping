import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { Product } from '../products.model';
import { ProductsCardListComponent } from '../products-card-list/products-card-list.component';
import { ProductsTableComponent } from '../products-table/products-table.component';

@Component({
  selector: 'app-products-list-main',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    ProductsCardListComponent,
    ProductsTableComponent
  ],
  templateUrl: './products-list-main.component.html',
  styleUrl: './products-list-main.component.scss'
})
export class ProductsListMainComponent {
  @Input() products: Product[] = [];
  @Input() isMobile = false;
  @Input() filter = '';
  @Input() loading = false;
  @Input() canAction = false;

  @Output() view = new EventEmitter<Product>();
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();
  @Output() loadMore = new EventEmitter<void>();
  @Output() loadPrevious = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<Product>();

  onView(product: Product) {
    this.view.emit(product);
  }

  onEdit(product: Product) {
    this.edit.emit(product);
  }

  onDelete(product: Product) {
    this.delete.emit(product);
  }

  onLoadMore(): void {
    this.loadMore.emit();
  }

  onLoadPrevious(): void {
    this.loadPrevious.emit();
  }

  onAddToCart(product: Product): void {
    this.addToCart.emit(product);
  }
}
