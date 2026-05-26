import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SUPPORTED_PROVIDERS } from '@entities/provider';
import { UserStore } from '@entities/user';
import { accountI18n } from '@features/settings';

@Component({
  selector: 'app-account-identities',
  imports: [TitleCasePipe],
  templateUrl: './identities.component.html',
  styleUrl: './identities.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdentitiesComponent {

  readonly userStore = inject(UserStore);
  readonly i18n = accountI18n['identities'];

  readonly identities = computed(() => {
    const linked = this.userStore.identities();
    return SUPPORTED_PROVIDERS.map(provider => ({
      provider: provider.id,
      oauthProvider: provider,
      identity: linked.find(i => i.provider === provider.id) ?? null,
      isLinked: linked.some(i => i.provider === provider.id),
    }));
  });
}
