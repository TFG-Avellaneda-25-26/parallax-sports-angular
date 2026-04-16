import { Routes } from '@angular/router';
import { AuthFormComponent } from '@pages/authForm';
import { authGuard } from '@features/auth';

export const routes: Routes = [
  // Unprotected pages
  {
    path: '',
    pathMatch: 'full',
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
  // Protected pages with resolver and guard
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('@pages/dashboard').then(m => m.DashboardPage)
      },
    ]
  },
  // Error pages
  {
    path: 'error',
    loadComponent: () => import('@pages/error/error-page').then(m => m.ErrorPage),
  },
  {
    path: '**',
    redirectTo: 'error',
  },
];
