import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { UserStore } from '@entities/user';
import { preferencesI18n } from '@features/settings/i18n/settings.i18n';
import { FormRoot, FormField, form, required, readonly, validate } from "@angular/forms/signals";
import { StatefulComboboxSelectInputComponent, StatefulInput } from "@shared/ui";

@Component({
  selector: 'app-date-format',
  imports: [FormRoot, StatefulComboboxSelectInputComponent, FormField, StatefulInput],
  templateUrl: './date-format.component.html',
  styleUrl: './date-format.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateFormatComponent {

  readonly userStore = inject(UserStore);
  readonly i18n = preferencesI18n['dateFormat'];

  readonly dateFormatOptions = [
    { value: 'MM/DD/YYYY', example: '05/19/2026' },
    { value: 'DD/MM/YYYY', example: '19/05/2026' },
    { value: 'YYYY/MM/DD', example: '2026/05/19' },
    { value: 'MMM D, YYYY', example: 'May 19, 2026'},
    { value: 'D MMM YYYY', example: '19 May 2026' },
  ];

  readonly dateFormatForm = form(
    signal({ currentFormat: this.userStore.dateFormat(), newFormat: '' }),
    (schemaPath) => {
      required(schemaPath.newFormat, { message: this.i18n.errorRequired });
      readonly(schemaPath.currentFormat);
      validate(schemaPath.newFormat, ({value, valueOf}) => {
        const newFormat = value();
        const currentFormat = valueOf(schemaPath.currentFormat);

        if (newFormat && currentFormat && newFormat === currentFormat) {
          return { kind: 'formatUnchanged', message: this.i18n.errorUnchanged };
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
            await this.userStore.updateSettings({ dateFormat: newFormat });
            field().value.set({ currentFormat: newFormat, newFormat: '' });
            field().reset();
            return null;
          } catch {
            return { kind: 'updateError', message: this.i18n.errorUpdate }
          }
      },
      ignoreValidators: 'none'
    }
  });
}
