import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { UserStore } from '@entities/user';
import { authFormI18n, AuthStore } from '@features/auth';
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
  readonly i18n = authFormI18n;

  switchMode(): void {
    this.authStore.toggleMode();
  }

  goToRecover(): void {
    let email = this.form.email().value();
    const isValid = this.form.email().valid();

    if (!isValid) {
      email = '';
    }

    this.authModeStore.goToRecover(email);
  }
}
