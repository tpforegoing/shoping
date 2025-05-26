import { Routes } from "@angular/router";

export const PRODUCT_DETAILS_ROUTES: Routes = [
  { 
    path: ':id', 
    loadComponent: () => import('./product-detail-page/product-detail-page.component').then(m => m.ProductDetailPageComponent) 
  }
];
