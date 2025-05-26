import { Routes } from "@angular/router";

export const PRODUCT_ROUTES: Routes = [
    { path: 'add',
      runGuardsAndResolvers: 'always',
      loadComponent: () => import('./product-add-edit/product-add-edit.component').then(m => m.ProductAddEditComponent)
    },
    {
      path: 'edit/:id',
      loadComponent: () => import('./product-add-edit/product-add-edit.component').then(m => m.ProductAddEditComponent)
    },
    // {
    //   path: 'details/:id',
    //   loadComponent: () => import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent)
    // },
    { 
      path: 'detail/:id', 
      loadComponent: () => import('../product-details/product-detail-page/product-detail-page.component').then(m => m.ProductDetailPageComponent) 
    },
    {
      path: '',
      loadComponent: () => import('./products-list/products-list.component').then(m => m.ProductsListComponent),
      runGuardsAndResolvers: 'always'
    }
  ];