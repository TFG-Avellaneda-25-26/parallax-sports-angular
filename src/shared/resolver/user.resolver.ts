import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { UserStore } from '@features/user/store/user.store';

export const userResolver: ResolveFn<boolean> = async (route, state) => {

  const userStore = inject(UserStore);

  try {
    await userStore.loadUser();
    return true;
  } catch (error) {
    throw error;
  }
};
