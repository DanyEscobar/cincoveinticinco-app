import { Routes } from '@angular/router';
import { LandingLayout } from './layouts/landing-layout';

export const routes: Routes = [
  {
    path: '',
    component: LandingLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/contact/contact').then(m => m.Contact)
      },
    ]
  },
  { path: '**', redirectTo: '' }
];
