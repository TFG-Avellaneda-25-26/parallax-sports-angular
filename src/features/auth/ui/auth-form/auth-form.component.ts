import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { UserStore } from '@entities/user';
import { AuthStore } from '@features/auth';
import { StatefulInput } from '@shared/ui';
import { SUPPORTED_PROVIDERS } from '@entities/provider';
import { AuthModeStore } from '@features/auth';

@Component({
  selector: 'app-auth-form',
  imports: [FormField, FormRoot, StatefulInput],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormComponent {
  readonly authStore = inject(AuthStore);
  readonly authModeStore = inject(AuthModeStore);
  readonly userStore = inject(UserStore)
  readonly form = this.authStore.authForm;
  readonly providers = SUPPORTED_PROVIDERS;

  switchMode(): void {
    this.authStore.toggleMode();
  }

  goToRecover(): void {
    if (this.authStore.authForm.email().valid()) {
      this.authModeStore.setRecoverEmail(this.authStore.authForm.email().value());
    }
    this.authModeStore.goToRecover();
  }
}
