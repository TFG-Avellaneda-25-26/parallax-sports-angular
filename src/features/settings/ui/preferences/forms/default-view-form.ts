import { inject, signal } from "@angular/core"
import { form, readonly, required, validate } from "@angular/forms/signals";
import { UserStore } from "@entities/user"
import { preferencesI18n } from "@features/settings/i18n/settings.i18n";

export const createDefaultViewForm = () => {

  const userStore = inject(UserStore);
  const i18n = preferencesI18n['defaultView'];

  return form(
    signal({ currentView: userStore.defaultView().toUpperCase(), newView: '' }),
    (schemePath) => {
      readonly(schemePath.currentView);
      required(schemePath.newView, { message: i18n.errorRequired });
      validate(schemePath.newView, ({ value, valueOf }) => {

        const newView = value();
        const currentView = valueOf(schemePath.currentView);

        if (newView && currentView && newView === currentView) {
          return {
            kind: 'viewUnchanged',
            message: i18n.errorUnchanged
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
            field().value.set({ currentView: newView.toUpperCase(), newView: '' });
            field().reset();
            return null;
          } catch {
            return {
              kind: 'updateError',
              message: i18n.errorUpdate
            }
          }
        },
        ignoreValidators: 'none'
      }
    }

  )
}
