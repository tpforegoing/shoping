import { Routes } from "@angular/router";

export const CATEGORY_ROUTES: Routes = [
    { path: 'add', loadComponent: () => import('./category-add-edit/category-add-edit.component').then(m => m.CategoryAddEditComponent) },
    { path: 'edit/:id', loadComponent: () => import('./category-add-edit/category-add-edit.component').then(m => m.CategoryAddEditComponent)},
    { path: '', loadComponent: () => import('./category-list/category-list.component').then(m => m.CategoryListComponent) }
  ];