import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { apply, form, FormRoot, FormField } from '@angular/forms/signals';
import { AuthService, passwordSchema } from '@entities/auth';
import { AuthModeStore } from '@features/auth/store/auth-mode.store';
import { lastValueFrom } from 'rxjs';
import { StatefulInput } from "@shared/ui";

@Component({
  selector: 'app-recover-password',
  imports: [StatefulInput, FormRoot, FormField],
  templateUrl: './recover-password.html',
  styleUrl: './recover-password.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoverPassword {

  readonly authModeStore = inject(AuthModeStore);
  readonly authService = inject(AuthService);

  readonly passwordForm = form(
    signal({ password: '', confirmPassword: '' }),
    (schemePath) => {
      apply(schemePath, passwordSchema);
    },
    {
      submission: {
        action: async (field) => {
          const { password } = field().value();
          const email = this.authModeStore.recoverEmail();
          const otp = this.authModeStore.recoverOtp();

          try {
            await lastValueFrom(this.authService.resetPassword(email, otp, password));
            this.authModeStore.goToAuth();
            return null;
          } catch {
            return { kind: 'resetError', message: 'Failed to reset password. Please try again.' };
          }
        }
      }
    }
  )
}
