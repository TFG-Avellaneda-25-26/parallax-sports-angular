import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthModeStore } from '@features/auth/store/auth-mode.store';
import { AuthFormComponent, RecoverEmail, RecoverOtp, RecoverPassword } from '@features/auth'

@Component({
  selector: 'app-auth-container',
  imports: [AuthFormComponent, RecoverEmail, RecoverOtp, RecoverPassword],
  templateUrl: './auth-container.html',
  styleUrl: './auth-container.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthContainer {
  readonly authModeStore = inject(AuthModeStore);
}
