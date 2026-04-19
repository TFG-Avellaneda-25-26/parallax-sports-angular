import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { UserStore } from '@entities/user';

export const redirectIfAuthenticatedGuard: CanActivateFn = async () => {
  const userStore = inject(UserStore);
  const router = inject(Router);

  try {
    await userStore.loadUser();

    if (userStore.isAuthenticated()) {
      return router.parseUrl('/dashboard');
    }
  } catch {
    return true;
  }

  return true;
};


