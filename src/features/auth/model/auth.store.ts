import { Injectable, inject, signal } from '@angular/core';
import { 
  FormMode 
} from './auth.types';
import { TokenStorage } from '../lib/token.storage';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private tokenStorage = inject(TokenStorage);

  currentFormMode = signal<FormMode>('login');
  isAuthenticated = signal(this.tokenStorage.isAuthenticated());

  setAuthenticated(): void {
    this.isAuthenticated.set(true);
  }

  logout(): void {
    this.isAuthenticated.set(false);
  }

  switchFormMode(mode: FormMode): void {
    this.currentFormMode.set(mode);
  }
}
