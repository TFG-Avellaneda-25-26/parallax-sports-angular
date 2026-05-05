import { inject, signal } from "@angular/core";
import { apply, form, readonly, validate } from "@angular/forms/signals";
import { emailAsyncSchema, emailSchema } from "@entities/auth";
import { UserStore } from "@entities/user"
import { API_BASE_URL } from "@shared/config";

export const createEmailForm = () =>  {
  const userStore = inject(UserStore);
  const apiBaseUrl = inject(API_BASE_URL);

  return form(
    signal({ currentEmail: userStore.email(), newEmail: ''}),
    (schemaPath) => {
      readonly(schemaPath.currentEmail);
      apply(schemaPath.newEmail, emailSchema);
      apply(schemaPath.newEmail, emailAsyncSchema(apiBaseUrl));
      validate(schemaPath.newEmail, ({ value, valueOf }) => {
        const newEmail = value();
        const currentEmail = valueOf(schemaPath.currentEmail);

        if (newEmail && currentEmail && newEmail === currentEmail) {
          return {
            kind: 'emailUnchanged',
            message: 'New email must be different from current email'
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
            return { kind: 'updateError', message: 'Failed to update email. Please try again.' };
          }
        },
        ignoreValidators: 'none'
      }
    }
  );
}
