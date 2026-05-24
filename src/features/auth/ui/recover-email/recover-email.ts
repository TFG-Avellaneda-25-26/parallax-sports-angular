import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { apply, form, FormField, FormRoot } from '@angular/forms/signals';
import { AuthService, emailAsyncSchema, emailSchema } from '@entities/auth';
import { authI18n, AuthModeStore } from '@features/auth';
import { API_BASE_URL } from '@shared/config';
import { StatefulInput } from '@shared/ui';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-recover-email',
  imports: [FormRoot, StatefulInput, FormField],
  templateUrl: './recover-email.html',
  styleUrl: './recover-email.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoverEmail {
  readonly apiBaseUrl = inject(API_BASE_URL);
  readonly authModeStore = inject(AuthModeStore);
  readonly authService = inject(AuthService);

  readonly i18n = authI18n.recover;

  goBack() {
    this.authModeStore.goToAuth();
  }

  readonly emailForm = form(
    signal({ email: this.authModeStore.recoverEmail() }),
    (schemaPath) => {
      apply(schemaPath.email, emailSchema);
      apply(schemaPath.email, emailAsyncSchema(this.apiBaseUrl, 'recover'));
    },
    {
      submission: {
        action: async (field) => {
          console.log('Submitting form with value:', field().value());
          const { email} = field().value();
          if (!email) return null;

          try {
            await lastValueFrom(this.authService.sendEmailRecovery(email));
            this.authModeStore.goToOtpStep(email);
            return null;
          } catch {
            return { kind: 'serverError', message: this.i18n.submitError };
          }
        },
        ignoreValidators: 'none'
      }
    }
  );
}
