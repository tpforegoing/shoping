import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// import { selectProduct, selectLoading, selectError } from '../store/product-price.selectors';
import { ProductOverviewComponent } from '../product-overview/product-overview.component';
import { ProductPriceSectionComponent } from '../product-price-section/product-price-section.component';
import { ProductActions } from '../../products/store/product.actions';
import { Product } from '../../products/products.model';
import { selectError, selectLoading, selectProductById } from '../../products/store/product.selectors';

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
    // Підписка на продукт
      this.store.select(selectProductById(id)).subscribe(product => {
        this.product.set(product);
      });

      // Підписка на помилку
      this.store.select(selectError).subscribe(error => {
        if (error) {
          console.log('Error state changed:', error);
        }
      });
    }
  }

  onBack(): void {
    const returnPage = this.route.snapshot.queryParamMap.get('Page');
    const returnFilter = this.route.snapshot.queryParamMap.get('Filter');

    const queryParams: any = {};
    if (returnPage) {
      queryParams.page = returnPage;
    }
    if (returnFilter) {
      queryParams.filter = returnFilter;
    }
    console.log('[BACK routing] NEED CHANGE !!!!', queryParams);
    this.router.navigate(['/products'], {
      queryParams
    });
    
  }
}