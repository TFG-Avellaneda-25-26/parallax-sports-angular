import { Routes } from '@angular/router';
import { LoginRegisterComponent, authGuard } from '@features/auth';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginRegisterComponent,
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

