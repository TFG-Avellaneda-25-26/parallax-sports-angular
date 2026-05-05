import { inject, signal } from "@angular/core";
import { apply, form, readonly, validate } from "@angular/forms/signals";
import { displayNameSchema } from "@entities/auth";
import { UserStore } from "@entities/user";

export const createdisplayNameForm = () => {

  const userStore = inject(UserStore);

  return form(
  signal({ currentDisplayName: userStore.displayName(), newDisplayName: '' }),
    (schemaPath) => {
      readonly(schemaPath.currentDisplayName);
      apply(schemaPath.newDisplayName, displayNameSchema);
      validate(schemaPath.newDisplayName, ({ value, valueOf }) => {
        const newDisplayName = value();
        const currentDisplayName = valueOf(schemaPath.currentDisplayName);

        if (newDisplayName && currentDisplayName && newDisplayName === currentDisplayName) {
          return {
            kind: 'displayNameUnchanged',
            message: 'New display name must be different from current display name'
          };
        }

        return null;
      });
    },
    {
      submission: {
        action: async (field) => {
          const newDisplayName = field().value().newDisplayName;
          if (!newDisplayName) return null;

          try {
            await userStore.updateDisplayName(newDisplayName);
            field().value.set({ currentDisplayName: newDisplayName, newDisplayName: '' });
            field().reset();
            return null;
          } catch {
            return { kind: 'updateError', message: 'Failed to update display name. Please try again.' };
          }
        },
        ignoreValidators: 'none'
      }
    }
  );
}
