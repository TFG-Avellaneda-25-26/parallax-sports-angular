import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { AuthStore } from '@features/auth/store/auth.store';
import { StatefulInput } from '@shared/ui';

@Component({
  selector: 'app-auth-form',
  imports: [FormField, FormRoot, StatefulInput],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormComponent {

  readonly authStore = inject(AuthStore);
  readonly form = this.authStore.authForm;
}
