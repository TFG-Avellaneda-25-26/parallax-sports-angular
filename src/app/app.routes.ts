import { Routes } from '@angular/router';
import { authGuard, redirectIfAuthenticatedGuard } from '@entities/user';
import { eventResolver } from '@features/event';


export const routes: Routes = [
  // Unprotected pages
  {
    path: '',
    pathMatch: 'full',
    canActivate: [redirectIfAuthenticatedGuard],
    loadComponent: () => import('@pages/landing').then(m => m.LandingPage),
  },
  {
    path: 'auth',
    canActivate: [redirectIfAuthenticatedGuard],
    loadComponent: () => import('@pages/auth').then(m => m.AuthPage),
  },
  // Protected pages
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      {
        path: 'dashboard',
        resolve: { events: eventResolver },
        loadComponent: () => import('@pages/dashboard').then(m => m.DashboardPage)
      },
      {
        path: 'settings',
        loadComponent: () => import('@pages/settings').then(m => m.SettingsPage)
      }
      // TODO: Add next protected pages
    ]
  },
  // Error pages
  {
    path: 'error',
    loadComponent: () => import('@pages/error').then(m => m.ErrorPage),
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
