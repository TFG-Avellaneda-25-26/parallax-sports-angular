import { inject, signal } from "@angular/core";
import { apply, form, readonly, validate } from "@angular/forms/signals";
import { emailAsyncSchema, emailSchema } from "@entities/auth";
import { UserStore } from "@entities/user"
import { API_BASE_URL } from "@shared/config";
import { accountI18n } from "@features/settings";

export const createEmailForm = () =>  {
  const userStore = inject(UserStore);
  const apiBaseUrl = inject(API_BASE_URL);

  return form(
    signal({ currentEmail: userStore.email(), newEmail: ''}),
    (schemaPath) => {
      readonly(schemaPath.currentEmail);
      apply(schemaPath.newEmail, emailSchema);
      apply(schemaPath.newEmail, emailAsyncSchema(apiBaseUrl, 'register'));
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
            await userStore.updateEmail(newEmail);
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
