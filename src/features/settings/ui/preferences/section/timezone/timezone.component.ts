import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, readonly, required, validate } from '@angular/forms/signals';
import { TIMEZONE_OPTIONS } from '@entities/timezone';
import { UserStore } from '@entities/user';
import { preferencesI18n } from '@features/settings';

@Component({
  selector: 'app-timezone',
  imports: [],
  templateUrl: './timezone.component.html',
  styleUrl: './timezone.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimezoneComponent {

  readonly timezonesOptions = TIMEZONE_OPTIONS;
  readonly userStore = inject(UserStore);
  readonly i18n = preferencesI18n['timezone'];

  readonly timezoneForm = form(
    signal({ currentTimezone: this.userStore.timezone(), timeZone: '' }),
    (schemaPath) => {
      readonly(schemaPath.currentTimezone);
      required(schemaPath.timeZone, { message: this.i18n.errorRequired });
      validate(schemaPath.timeZone, ({ value, valueOf }) => {
        const timeZone = value();
        const currentTimeZone = valueOf(schemaPath.currentTimezone);

        if (!timeZone) return null;

        if (timeZone && currentTimeZone && timeZone === currentTimeZone) {
          return {
            kind: 'timeZoneUnchanged',
            message: this.i18n.errorUnchanged
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
            await this.userStore.updateSettings({ timezone: timeZone });
            field().value.set({ currentTimezone: timeZone, timeZone: '' });
            field().reset();
            return null;
          } catch {
            return { kind: 'updateError', message: this.i18n.errorUpdate };
          }
        },
        ignoreValidators: 'none'
      }
    }
  );
}
