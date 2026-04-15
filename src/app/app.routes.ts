import { Routes } from '@angular/router';
import { userResolver } from '@shared/resolver';

export const routes: Routes = [
  // Unprotected pages
  {
    path: '',
    pathMatch: 'full',
    // TODO?: Add Guard to redirect to dashboard if user is already authenticated
    loadComponent: () => import('@pages/landing').then(m => m.LandingPage),
  },
  // TODO: Add AuthForm page
  // Added separated '' path for protected pages to easily add AuthGuard and UserResolver wihout affecting landing, error, authform pages
  {
    path: '',
    // TODO: Add AuthGuard
    resolve: { user: userResolver },

    // Adding the UserResolver here will make sure that the user data is loaded before loading any of the protected pages
    // for example if we want to load events and filter with user preferences
    children: [
      {
        path: 'dashboard',
        // TODO?: Add Event Resolver in case we want to load events before loading the dashboard page
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
