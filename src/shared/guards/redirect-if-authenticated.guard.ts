import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { UserStore } from '@entities/user';

export const redirectIfAuthenticatedGuard: CanActivateFn = async (route, state) => {
  const userStore = inject(UserStore);
  const router = inject(Router);

  try {
    await userStore.loadUser();

    if (userStore.isAuthenticated()) {
      return router.parseUrl('/dashboard');
    }
  } catch (error) {
    console.log('Error loading user in redirectIfAuthenticatedGuard', error);
    return true;
  }

  return true;
};


