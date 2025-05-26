import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { selectProductById, selectLoading, selectError } from '../store/product.selectors';
import { Product } from '../products.model';
import { ProductActions } from '../store/product.actions';
import { ProductOverviewComponent } from './product-overview/product-overview.component';
import { ProductPriceSectionComponent } from './product-price-section/product-price-section.component';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    ProductOverviewComponent,
    ProductPriceSectionComponent
  ],
  templateUrl: './product-detail-page.component.html',
  styleUrls: ['./product-detail-page.component.scss']
})
export class ProductDetailPageComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  readonly productId = signal<number>(0);
  product = signal<Product | null>(null);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly error = this.store.selectSignal(selectError);
  
  ngOnInit(): void {
    console.log('ProductDetailPageComponent ngOnInit');
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.productId.set(id);
      
      // Load product from backend
      this.store.dispatch(ProductActions.details({ id }));
      
      // Subscribe to product changes
      this.store.select(selectProductById(id)).subscribe(product => {
        this.product.set(product);
      });
      
      // Add error logging
      this.store.select(selectError).subscribe(error => {
        if (error) {
          console.log('Error state changed:', error);
        }
      });
    }
  }
  
  onBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
