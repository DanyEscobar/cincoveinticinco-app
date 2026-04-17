import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layouts/dashboard-layout';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'users',
        loadChildren: () => import('./pages/user/user.router').then(m => m.routes)
      },
    ]
    // children: [
    //   { path: '', redirectTo: 'registro', pathMatch: 'full' },
    //   {
    //     path: 'registro',
    //     loadComponent: () => import('./components/contact-form/contact-form.component').then(m => m.ContactFormComponent)
    //   },
    //   {
    //     path: 'lista',
    //     loadComponent: () => import('./components/user-table/user-table.component').then(m => m.UserTableComponent)
    //   },
    //   {
    //     path: 'editar/:id',
    //     loadComponent: () => import('./components/edit-user-page/edit-user-page.component').then(m => m.EditUserPageComponent)
    //   }
    // ]
  },
  // { path: '**', redirectTo: '' }
];
