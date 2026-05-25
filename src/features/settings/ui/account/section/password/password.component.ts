import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { apply, debounce, form, validate, validateHttp, FormRoot, FormField } from '@angular/forms/signals';
import { loginPasswordSchema, passwordSchema } from '@entities/auth';
import { UserStore } from '@entities/user';
import { accountI18n } from '@features/settings';
import { API_BASE_URL } from '@shared/config';
import { StatefulInput } from "@shared/ui";

@Component({
  selector: 'app-account-password',
  imports: [FormRoot, StatefulInput, FormField],
  templateUrl: './password.component.html',
  styleUrl: './password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordComponent {

  readonly userStore = inject(UserStore);
  readonly apiBaseUrl = inject(API_BASE_URL);
  readonly i18n = accountI18n['password'];

  readonly passwordForm = form(
    signal({ currentPassword: '', password: '', confirmPassword: '' }),
    (schemaPath) => {
      apply(schemaPath.currentPassword, loginPasswordSchema);
      apply(schemaPath, passwordSchema);
      debounce(schemaPath.currentPassword, 1000);
      validateHttp<string, boolean>(schemaPath.currentPassword, {
        request: ({value}) => {
          const currentPassword = value();
          if (!currentPassword) return undefined;

          return {
            url: `${this.apiBaseUrl}/api/users/validate-password`,
            method: 'POST',
            body: currentPassword,
            withCredentials: true
          }
        },
        onSuccess: (isValid) => {
          return isValid
          ? null
          : {
            kind: 'wrongPassword',
            message: accountI18n.password.errorWrong
           };
        },
        onError: (error) => {
          console.error('Error validating password', error);
          return {
            kind: 'serverError',
            message: accountI18n.password.errorServer
          };
        }
      });
      validate(schemaPath.password, ({value, valueOf}) => {
        const newPassword = value();
        const currentPassword = valueOf(schemaPath.currentPassword);

        if (newPassword && currentPassword && newPassword === currentPassword) {
          return {
            kind: 'sameAsCurrent',
              message: accountI18n.password.errorSame
            };
          }

        return null;
      });
    },
    {
      submission: {
        action: async (field) => {
          const password = field().value().password;
          if (!password) return null;

          try {
            await this.userStore.updatePassword(password);
            field().value.set({ currentPassword: '', password: '', confirmPassword: '' });
            field().reset();
            return null;
          } catch {
            return {
              kind: 'updateError',
              message: accountI18n.password.errorUpdate
            }
          }
        },
        ignoreValidators: 'none'
      }
    }
  );
}
