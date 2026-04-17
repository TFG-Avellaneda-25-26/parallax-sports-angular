import { Routes } from '@angular/router';
import { AuthFormComponent } from '@pages/authForm';
import { userResolver, eventResolver } from '@shared/resolver';


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
    path: '',
    // TODO: Add AuthGuard
    resolve: { user: userResolver },
    // Adding the UserResolver here will make sure that the user data is loaded before loading any of the protected pages
    // for example if we want to load events and filter with user preferences
    children: [
      {
        path: 'dashboard',
        resolve: { events: eventResolver },
        loadComponent: () => import('@pages/dashboard').then(m => m.DashboardPage)
      },
      // TODO: Add next protected pages
    ]

  },
  {
    path: 'register',
    redirectTo: '/login',
  },
  // Protected pages with resolver and guard
  {
    path: '',
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
