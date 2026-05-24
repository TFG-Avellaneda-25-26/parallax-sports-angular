import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { FormRoot, FormField } from '@angular/forms/signals';
import { UserStore } from '@entities/user';
import { StatefulInput } from "@shared/ui";
import { createEmailForm } from './forms/email-form';
import { createPasswordForm } from './forms/password-form';
import { createdisplayNameForm } from './forms/display-name-form';
import { SettingsNavStore } from '@shared/stores';
import { scrollToSection } from '@shared/lib';
import { SUPPORTED_PROVIDERS } from '@entities/provider';
import { TitleCasePipe } from '@angular/common';
import { accountI18n } from '@features/settings';

@Component({
  selector: 'app-settings-account',
  imports: [FormRoot, StatefulInput, FormField, TitleCasePipe],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {

  readonly i18n = accountI18n;
  readonly navStore = inject(SettingsNavStore);
  readonly userStore = inject(UserStore);

  readonly displayNameForm = createdisplayNameForm();
  readonly emailForm = createEmailForm();
  readonly passwordForm = createPasswordForm();

  readonly identities = computed(() => {
  const linked = this.userStore.identities();
  return SUPPORTED_PROVIDERS.map(provider => ({
    provider: provider.id,
    oauthProvider: provider,
    identity: linked.find(i => i.provider === provider.id) ?? null,
    isLinked: linked.some(i => i.provider === provider.id),
  }));
});

  constructor() {
    effect(() => {
      const section = this.navStore.activeSectionId();
      if (!section) return;

      const el = document.getElementById(section);
      if (!el) return;

      // Defer one tick so the freshly-mounted view is in the DOM before we
      // measure / scroll. Effects already run after CD but route transitionshttp://localhost:4200/dashboard
      // can race this.
      setTimeout(() => scrollToSection(el), 0);
    })
  }
}
