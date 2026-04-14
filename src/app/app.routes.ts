import { Routes } from '@angular/router';
import { AuthFormComponent, authGuard } from '@pages/auth';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@pages/landing').then(m => m.LandingPage),
  },
  {
    path: 'login',
    component: AuthFormComponent,
  },
  {
    path: 'register',
    redirectTo: '/login',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('@pages/dashboard/ui/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'error',
    loadComponent: () => import('@pages/error/error-page').then(m => m.ErrorPage),
  },
  {
    path: '**',
    redirectTo: 'error',
  },
];
