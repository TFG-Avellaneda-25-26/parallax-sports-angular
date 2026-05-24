import { inject, signal } from "@angular/core";
import { form, readonly, required, validate } from "@angular/forms/signals";
import { UserStore } from "@entities/user";
import { preferencesI18n } from "@features/settings/i18n/settings.i18n";

export const createTimeZoneForm = () =>{

  const userStore = inject(UserStore);
  const i18n = preferencesI18n['timezone'];

  return form(
    signal({ currentTimezone: userStore.timezone(), timeZone: '' }),
    (schemaPath) => {
      readonly(schemaPath.currentTimezone);
      required(schemaPath.timeZone, { message: i18n.errorRequired });
      validate(schemaPath.timeZone, ({ value, valueOf }) => {
        const timeZone = value();
        const currentTimeZone = valueOf(schemaPath.currentTimezone);

        if (!timeZone) return null;

        if (timeZone && currentTimeZone && timeZone === currentTimeZone) {
          return {
            kind: 'timeZoneUnchanged',
            message: i18n.errorUnchanged
          };
        }
        return null;
      });
    },
    {
      submission: {
        action: async (field) => {
          const timeZone = field().value().timeZone;
          if (!timeZone) return null;

          try {
            await userStore.updateTimeZone(timeZone);
            field().value.set({ currentTimezone: timeZone, timeZone: '' });
            field().reset();
            return null;
          } catch {
            return { kind: 'updateError', message: i18n.errorUpdate };
          }
        },
        ignoreValidators: 'none'
      }
    }
  );
}
