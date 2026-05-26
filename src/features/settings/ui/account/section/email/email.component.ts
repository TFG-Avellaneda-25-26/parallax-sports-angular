import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { apply, form, readonly, validate, FormRoot, FormField } from '@angular/forms/signals';
import { emailAsyncSchema, emailSchema } from '@entities/auth';
import { UserStore } from '@entities/user';
import { accountI18n } from '@features/settings';
import { API_BASE_URL } from '@shared/config';
import { StatefulInput } from "@shared/ui";

@Component({
  selector: 'app-account-email',
  imports: [StatefulInput, FormRoot, FormField],
  templateUrl: './email.component.html',
  styleUrl: './email.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailComponent {

  readonly userStore = inject(UserStore);
  readonly apiBaseUrl = inject(API_BASE_URL);
  readonly i18n = accountI18n['email'];

  readonly emailForm = form(
    signal({ currentEmail: this.userStore.email(), newEmail: ''}),
    (schemaPath) => {
      readonly(schemaPath.currentEmail);
      apply(schemaPath.newEmail, emailSchema);
      apply(schemaPath.newEmail, emailAsyncSchema(this.apiBaseUrl, 'register'));
      validate(schemaPath.newEmail, ({ value, valueOf }) => {
        const newEmail = value();
        const currentEmail = valueOf(schemaPath.currentEmail);

        if (newEmail && currentEmail && newEmail === currentEmail) {
          return {
            kind: 'emailUnchanged',
            message: accountI18n.email.errorUnchanged
          };
        }

        return null;
      });
    },
    {
      submission: {
        action: async (field) => {
          const newEmail = field().value().newEmail;
          if (!newEmail) return null;

          try {
            await this.userStore.updateEmail(newEmail);
            field().value.set({ currentEmail: newEmail, newEmail: '' });
            field().reset();
            return null;
          } catch {
            return { kind: 'updateError', message: accountI18n.email.errorUpdate };
          }
        },
        ignoreValidators: 'none'
      }
    }
  );
}
