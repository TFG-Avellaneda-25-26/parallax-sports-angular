import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'error',
    loadComponent: () => import('@pages/error/error-page').then(m => m.ErrorPage)
  },
  {
    path: '**',
    redirectTo: 'error'
  }
];
