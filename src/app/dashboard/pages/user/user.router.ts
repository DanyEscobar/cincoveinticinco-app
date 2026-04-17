import { Routes } from '@angular/router';
import { UserIndex } from './user-index/user-index';
import { EditUser } from './edit-user/edit-user';

export const routes: Routes = [
  {
    path: '',
    component: UserIndex,
  },
  {
    path: 'edit-user/:id',
    component: EditUser,
  },
  {
    path: '**',
    redirectTo: '',
  }
];