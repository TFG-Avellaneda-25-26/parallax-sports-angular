import { Router, type CanActivateChildFn } from '@angular/router';
import { UserStore } from '../store/user.store';
import { inject } from '@angular/core';

export const authGuard: CanActivateChildFn = async (childRoute, state) => {
  const userStore = inject(UserStore);
  const router = inject(Router);

  try {
    await userStore.loadUser();
    if (userStore.isAuthenticated()) return true;
    return router.parseUrl('/');
  } catch(error) {
    router.navigate(['/error']);
    return false;
  }
};
