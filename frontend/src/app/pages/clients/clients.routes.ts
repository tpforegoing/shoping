import { Routes } from "@angular/router";

export const CLIENTS_ROUTES: Routes = [
  { 
    path: 'add', 
    loadComponent: () => import('./client-add-edit/client-add-edit.component').then(m => m.ClientAddEditComponent) 
  },
  { 
    path: 'edit/:id', 
    loadComponent: () => import('./client-add-edit/client-add-edit.component').then(m => m.ClientAddEditComponent) 
  },
  { 
    path: 'detail/:id', 
    loadComponent: () => import('./client-detail/client-detail.component').then(m => m.ClientDetailComponent) 
  },
  { 
    path: '', 
    loadComponent: () => import('./clients.component').then(m => m.ClientsComponent) 
  }
];
