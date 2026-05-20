import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormRoot, FormField } from '@angular/forms/signals';
import { UserStore } from '@entities/user';
import { StatefulInput } from "@shared/ui";
import { createEmailForm } from './forms/email-form';
import { createPasswordForm } from './forms/password-form';
import { createdisplayNameForm } from './forms/display-name-form';
import { SettingsNavStore } from '@shared/stores';

@Component({
  selector: 'app-settings-account',
  imports: [FormRoot, StatefulInput, FormField],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {

  readonly navStore = inject(SettingsNavStore);
  readonly userStore = inject(UserStore);

  readonly displayNameForm = createdisplayNameForm();
  readonly emailForm = createEmailForm();
  readonly passwordForm = createPasswordForm();
  readonly identites = this.userStore.linkedProviders;

  constructor() {
    effect(() => {
      const section = this.navStore.activeSectionId();
      if (!section) return;

      const el = document.getElementById(section);
      if (!el) return;

      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('section--active');
      setTimeout(() => el.classList.remove('section--active'), 1500);
    })
  }
}
