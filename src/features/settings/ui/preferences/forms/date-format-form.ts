import { inject, signal } from "@angular/core";
import { form, readonly, required, validate } from "@angular/forms/signals";
import { UserStore } from "@entities/user";
import { preferencesI18n } from "@features/settings/i18n/settings.i18n";

export const createDateFormatForm = () => {

  const userStore = inject(UserStore);
  const i18n = preferencesI18n['dateFormat'];

  return form(
    signal({ currentFormat: userStore.dateFormat(), newFormat: '' }),
    (schemaPath) => {
      required(schemaPath.newFormat, { message: i18n.errorRequired });
      readonly(schemaPath.currentFormat);
      validate(schemaPath.newFormat, ({value, valueOf}) => {
        const newFormat = value();
        const currentFormat = valueOf(schemaPath.currentFormat);

        if (newFormat && currentFormat && newFormat === currentFormat) {
          return { kind: 'formatUnchanged', message: i18n.errorUnchanged };
        }

        return null;
      });
    },
    {
      submission: {
        action: async (field) => {
          const newFormat = field().value().newFormat;
          if (!newFormat) return null;

          try {
            await userStore.updateDateFormat(newFormat);
            field().value.set({ currentFormat: newFormat, newFormat: '' });
            field().reset();
            return null;
          } catch {
            return { kind: 'updateError', message: i18n.errorUpdate }
          }
      },
      ignoreValidators: 'none'
    }
  });
}
