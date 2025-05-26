import { Routes } from "@angular/router";

export const PRICE_ROUTES: Routes = [
    { path: '', loadComponent: () => import('./price.component').then(m => m.PriceComponent) },
    { path: 'edit/:id', loadComponent: () => import('./price-add-edit/price-add-edit.component').then(m => m.PriceAddEditComponent) },
    { path: 'add', loadComponent: () => import('./price-add-edit/price-add-edit.component').then(m => m.PriceAddEditComponent) },
];