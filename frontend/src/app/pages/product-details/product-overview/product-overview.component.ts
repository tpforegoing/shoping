import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Product } from '../../products/products.model';


@Component({
  selector: 'app-product-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './product-overview.component.html',
  styleUrls: ['./product-overview.component.scss']
})
export class ProductOverviewComponent {
  @Input() product: Product | null = null;
  @Output() back = new EventEmitter<void>();
  
  getCategoryName(product: Product | null): string {
    if (!product || !product.category) return 'No category';
    return typeof product.category === 'object' ? product.category.title : 'Unknown category';
  }

  getCategoryFullTitle(product: Product | null): string {
    if (!product || !product.category) return '';
    return typeof product.category === 'object' ? product.category.full_title || '' : '';
  }

  getCategoryIcon(product: Product | null): string {
    if (!product || !product.category) return 'category';
    return typeof product.category === 'object' ? product.category.icon || 'category' : 'category';
  }
  
  getValidFrom(product: Product | null): string {
    if (!product || !product.current_price) return 'Not set';
    return this.formatDate(product.current_price.valid_from);
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  }
  
  onBack(): void {
    this.back.emit();
  }
}

