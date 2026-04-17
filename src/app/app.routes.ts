import { Routes } from '@angular/router';
import { authGuard, redirectIfAuthenticatedGuard } from '@features/user/guards';
import { eventResolver } from '@shared/resolver';
import { AuthFormComponent } from '@pages/authForm';


export const routes: Routes = [
  // Unprotected pages
  {
    path: '',
    pathMatch: 'full',
    canActivate: [redirectIfAuthenticatedGuard],
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
