import { form, readonly, required, validate, FormRoot, FormField } from '@angular/forms/signals';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { UserStore } from '@entities/user';
import { preferencesI18n } from '@features/settings';
import { StatefulInput, StatefulComboboxSelectInputComponent } from "@shared/ui";

@Component({
  selector: 'app-default-view',
  imports: [FormRoot, StatefulInput, StatefulComboboxSelectInputComponent, FormField],
  templateUrl: './default-view.component.html',
  styleUrl: './default-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultViewComponent {

  readonly userStore = inject(UserStore);
  readonly i18n = preferencesI18n['defaultView'];

  readonly defaultViewOptions = [
    { value: 'cards' },
    { value: 'table' },
  ];

  readonly defaultViewForm = form(
    signal({ currentView: this.userStore.defaultView(), newView: '' }),
    (schemePath) => {
      readonly(schemePath.currentView);
      required(schemePath.newView, { message: this.i18n.errorRequired });
      validate(schemePath.newView, ({ value, valueOf }) => {

        const newView = value();
        const currentView = valueOf(schemePath.currentView);

        if (newView && currentView && newView === currentView) {
          return {
            kind: 'viewUnchanged',
            message: this.i18n.errorUnchanged
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
            await this.userStore.updateSettings({ defaultView: newView as 'cards' | 'table' });
            field().value.set({ currentView: newView, newView: '' });
            field().reset();
            return null;
          } catch {
            return {
              kind: 'updateError',
              message: this.i18n.errorUpdate
            }
          }
        },
        ignoreValidators: 'none'
      }
    }
  )
}
