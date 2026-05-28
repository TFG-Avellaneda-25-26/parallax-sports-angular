import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { SettingsNavStore } from '@shared/stores';
import { scrollToSection } from '@shared/lib';
import { accountI18n } from '@features/settings';
import { EmailComponent } from "./section/email/email.component";
import { PasswordComponent } from "./section/password/password.component";
import { DisplayNameComponent } from "./section/display-name/display-name.component";
import { IdentitiesComponent } from "./section/identities/identities.component";
import { DeleteAccountComponent } from "./section/delete-account/delete-account.component";

@Component({
  selector: 'app-settings-account',
  imports: [EmailComponent, PasswordComponent, DisplayNameComponent, IdentitiesComponent, DeleteAccountComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {

  readonly i18n = accountI18n;
  readonly navStore = inject(SettingsNavStore);

  constructor() {
    effect(() => {
      const section = this.navStore.activeSectionId();
      if (!section) return;
      const el = document.getElementById(section);
      if (!el) return;
      scrollToSection(el);
    })
  }
}
