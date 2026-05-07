import { inject, signal } from "@angular/core";
import { form, readonly, required, validate } from "@angular/forms/signals";
import { UserStore } from "@entities/user";

export const createTimeZoneForm = () =>{

  const userStore = inject(UserStore);

  return form(
    signal({ currentTimezone: userStore.timeZone(), timeZone: userStore.timeZone() }),
    (schemaPath) => {
      readonly(schemaPath.currentTimezone);
      required(schemaPath.timeZone);
      validate(schemaPath.timeZone, ({ value, valueOf }) => {
        const timeZone = value();
        const currentTimeZone = valueOf(schemaPath.currentTimezone);

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
