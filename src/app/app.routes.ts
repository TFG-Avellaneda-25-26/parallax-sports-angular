import { Routes } from '@angular/router';
import { AuthFormComponent, authGuard } from '@features/auth';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
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
];

