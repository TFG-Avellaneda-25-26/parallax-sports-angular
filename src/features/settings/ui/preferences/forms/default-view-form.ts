import { inject, signal } from "@angular/core"
import { form, readonly, required, validate } from "@angular/forms/signals";
import { UserStore } from "@entities/user"

export const createDefaultViewForm = () => {

  const userStore = inject(UserStore);

  return form(
    signal({ currentView: '', newView: '' }),
    (schemePath) => {
      readonly(schemePath.currentView);
      required(schemePath.newView, { message: 'Default view is required' });
      validate(schemePath.newView, ({ value, valueOf }) => {

        const newView = value();
        const currentView = valueOf(schemePath.currentView);

        if (newView && currentView && newView === currentView) {
          return {
            kind: 'viewUnchanged',
            message: 'New default view must be different from current default view'
          };
        }

        return null;
      });
    },
    {
      submission: {
        action: async (field) => {
          const newView = field().value().newView;

          if (!newView) return null;

          try {
            await userStore.updateDefaultView(newView);
            field().reset();
            return null;
          } catch {
            return {
              kind: 'updateError',
              message: 'Failed to update default view. Please try again.'
            }
          }
        },
        ignoreValidators: 'none'
      }
    }

  )
}
