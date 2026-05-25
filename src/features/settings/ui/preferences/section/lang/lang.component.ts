import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { StatefulComboboxSelectInputComponent, StatefulInput } from "@shared/ui";
import { FormRoot, FormField, form, required, readonly, validate } from "@angular/forms/signals";
import { preferencesI18n } from '@features/settings';
import { UserStore } from '@entities/user';

@Component({
  selector: 'app-lang',
  imports: [StatefulComboboxSelectInputComponent, FormRoot, FormField, StatefulInput],
  templateUrl: './lang.component.html',
  styleUrl: './lang.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangComponent {

  readonly i18n = preferencesI18n['lang'];
  readonly userStore = inject(UserStore);

  readonly langOptions = [
    { value: 'en', example: 'English' },
    { value: 'es', example: 'Español' },
  ];

  readonly langForm = form(
    signal({ currentLang: this.userStore.lang(), newLang: '' }),
    (schemaPath) => {
      readonly(schemaPath.currentLang);
      required(schemaPath.newLang, { message: this.i18n.errorRequired });
      validate(schemaPath.newLang, ({ value, valueOf }) => {
        const newLang = value();
        const currentLang = valueOf(schemaPath.currentLang);

        if (newLang === currentLang) {
          return { kind: 'unchanged', message: this.i18n.errorUnchanged };
        }

        return null;
      })
    },
    {
      submission: {
        action: async (field) => {
          const { newLang } = field().value();
          if (!newLang) return;

          try {
            await this.userStore.updateLang(newLang);
            field().value.set({ currentLang: newLang, newLang: '' });
            field().reset();
            return null;
          } catch {
            return { kind: 'updateError', message: this.i18n.errorUpdate };
          }
        },
        ignoreValidators: 'none'
      }
    }
  )


}
