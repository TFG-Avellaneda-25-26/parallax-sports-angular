import { Routes } from '@angular/router';
import { authGuard, redirectIfAuthenticatedGuard } from '@features/user/guards';
import { eventResolver } from '@shared/resolver';

export const routes: Routes = [
  // Unprotected pages
  {
    path: '',
    pathMatch: 'full',
    canActivate: [redirectIfAuthenticatedGuard],
    loadComponent: () => import('@pages/landing').then(m => m.LandingPage),
  },
  // TODO: Add AuthForm page
  // Added a separate '' path for protected pages to easily add AuthGuard and UserResolver without affecting landing, error, and auth form pages
  {
    path: '',
    canActivateChild: [authGuard],
    // Removed userResolver from here since AuthGuard already load the user
    children: [
      {
        path: 'dashboard',
        resolve: { events: eventResolver },
        loadComponent: () => import('@pages/dashboard').then(m => m.DashboardPage)
      },
      // TODO: Add next protected pages
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
