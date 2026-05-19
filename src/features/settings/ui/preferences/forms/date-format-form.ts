import { inject, signal } from "@angular/core";
import { form, readonly, required, validate } from "@angular/forms/signals";
import { UserStore } from "@entities/user";

export const createDateFormatForm = () => {

  const userStore = inject(UserStore);

  return form(
    signal({ currentFormat: '', newFormat: '' }),
    (schemaPath) => {
      required(schemaPath.newFormat, { message: 'Date format is required' });
      readonly(schemaPath.currentFormat);
      validate(schemaPath.newFormat, ({value, valueOf}) => {
        const newFormat = value();
        const currentFormat = valueOf(schemaPath.currentFormat);

        if (newFormat && currentFormat && newFormat === currentFormat) {
          return { kind: 'formatUnchanged', message: 'New date format must be different from current date format' };
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
            field().reset();
            return null;
          } catch {
            return { kind: 'updateError', message: 'Failed to update date format. Please try again.' }
          }
      },
      ignoreValidators: 'none'
    }
  });
}
