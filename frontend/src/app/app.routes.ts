import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
// import { provideRouter } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
// import { DashboardClientComponent } from './dashboard/dashboard-client/dashboard-client.component';
import { LayoutComponent } from './layout/layout.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import { auth_prefix } from './auth/auth.model';
import { CATEGORY_ROUTES } from './pages/categories/category.routes';
import { PRODUCT_ROUTES } from './pages/products/products.routes';
import { PRODUCT_DETAILS_ROUTES } from './pages/product-details/product-details.routes';
import { PRICE_ROUTES } from './pages/price/price.router';
import { CLIENTS_ROUTES } from './pages/clients/clients.routes';
import { ORDERS_ROUTES } from './pages/orders/orders.routes';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard-client/dashboard-client.component').then(m => m.DashboardClientComponent) },
      { path: 'category',
          children: CATEGORY_ROUTES,
          runGuardsAndResolvers: 'always'
       },
      { path: 'products',
          children: PRODUCT_ROUTES,
          runGuardsAndResolvers: 'always'
      },
      { path: 'price',
          children: PRICE_ROUTES,
          runGuardsAndResolvers: 'always'
       },
      { path: 'product-details',
          children: PRODUCT_DETAILS_ROUTES,
          runGuardsAndResolvers: 'always'
      },
      { path: 'clients',
          children: CLIENTS_ROUTES,
          runGuardsAndResolvers: 'always'
      },
      { path: 'orders',
          children: ORDERS_ROUTES,
          runGuardsAndResolvers: 'always'
      },

    ],
  },
  {
    path: auth_prefix,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent }
    ]
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
