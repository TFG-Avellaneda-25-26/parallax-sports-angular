import { inject, signal } from "@angular/core";
import { form, readonly, required, validate } from "@angular/forms/signals";
import { UserStore } from "@entities/user";

export const createTimeZoneForm = () =>{

  const userStore = inject(UserStore);

  return form(
    signal({ currentTimezone: userStore.timezone(), timeZone: '' }),
    (schemaPath) => {
      readonly(schemaPath.currentTimezone);
      required(schemaPath.timeZone, { message: 'Time zone is required' });
      validate(schemaPath.timeZone, ({ value, valueOf }) => {
        const timeZone = value();
        const currentTimeZone = valueOf(schemaPath.currentTimezone);

        if (!timeZone) return null;

        if (timeZone && currentTimeZone && timeZone === currentTimeZone) {
          return {
            kind: 'timeZoneUnchanged',
            message: 'New time zone must be different from current time zone'
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
            return { kind: 'updateError', message: 'Failed to update time zone. Please try again.' };
          }
        },
        ignoreValidators: 'none'
      }
    }
  );
}
