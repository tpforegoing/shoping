import { Routes } from "@angular/router";

export const ORDERS_ROUTES: Routes = [
  {
    path: 'add',
    loadComponent: () => import('./order-add-edit/order-add-edit.component').then(m => m.OrderAddEditComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./order-add-edit/order-add-edit.component').then(m => m.OrderAddEditComponent)
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./order-detail/order-detail.component').then(m => m.OrderDetailComponent)
  },
  {
    path: 'item/add',
    loadComponent: () => import('./order-item-add-edit/order-item-add-edit.component').then(m => m.OrderItemAddEditComponent)
  },
  {
    path: 'item/edit/:id',
    loadComponent: () => import('./order-item-add-edit/order-item-add-edit.component').then(m => m.OrderItemAddEditComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./order-cart/order-cart.component').then(m => m.OrderCartComponent)
  },
  {
    path: '',
    loadComponent: () => import('./orders.component').then(m => m.OrdersComponent)
  }
];
