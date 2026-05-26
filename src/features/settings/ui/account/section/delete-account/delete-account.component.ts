import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserStore } from '@entities/user';
import { accountI18n } from '@features/settings/i18n/settings.i18n';

@Component({
  selector: 'app-account-delete-account',
  imports: [],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteAccountComponent {

  readonly userStore = inject(UserStore);
  readonly i18n = accountI18n['deleteAccount'];
}
