import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { apply, form, readonly, validate, FormRoot, FormField } from '@angular/forms/signals';
import { displayNameSchema } from '@entities/auth';
import { UserStore } from '@entities/user';
import { accountI18n } from '@features/settings';
import { StatefulInput } from "@shared/ui";

@Component({
  selector: 'app-account-display-name',
  imports: [FormRoot, StatefulInput, FormField],
  templateUrl: './display-name.component.html',
  styleUrl: './display-name.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayNameComponent {

  readonly userStore = inject(UserStore);
  readonly i18n = accountI18n['displayName'];

  readonly displayNameForm = form(
  signal({ currentDisplayName: this.userStore.displayName(), newDisplayName: '' }),
    (schemaPath) => {
      readonly(schemaPath.currentDisplayName);
      apply(schemaPath.newDisplayName, displayNameSchema);
      validate(schemaPath.newDisplayName, ({ value, valueOf }) => {
        const newDisplayName = value();
        const currentDisplayName = valueOf(schemaPath.currentDisplayName);

        if (newDisplayName && currentDisplayName && newDisplayName === currentDisplayName) {
          return {
            kind: 'displayNameUnchanged',
            message: this.i18n.errorUnchanged
          };
        }

        return null;
      });
    },
    {
      submission: {
        action: async (field) => {
          const newDisplayName = field().value().newDisplayName;
          if (!newDisplayName) return null;

          try {
            await this.userStore.updateDisplayName(newDisplayName);
            field().value.set({ currentDisplayName: newDisplayName, newDisplayName: '' });
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
