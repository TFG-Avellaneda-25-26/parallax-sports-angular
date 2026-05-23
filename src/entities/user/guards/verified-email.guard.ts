import { Router, type CanActivateFn } from '@angular/router';
import { UserStore } from '@entities/user';
import { inject } from '@angular/core';

export const verifiedEmailGuard: CanActivateFn = async () => {
  const userStore = inject(UserStore);
  const router = inject(Router);

  try {
    await userStore.loadUser();
    if (userStore.isVerified()) return true;
    return router.parseUrl('/');
  } catch {
    router.navigate(['/error']);
    return false;
  }
};
