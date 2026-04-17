import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.routes),
  },
  {
    path: 'contact',
    loadChildren: () => import('./landing/landing.routes').then(m => m.routes),
  },
  {
    path: '**',
    redirectTo: 'contact'
  }
];