import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { AuthService } from '@entities/auth';
import { AuthModeStore } from '@features/auth/store/auth-mode.store';
import { lastValueFrom } from 'rxjs';
import { OtpInputComponent } from "@shared/ui";
import { authI18n } from '@features/auth';

@Component({
  selector: 'app-recover-otp',
  imports: [OtpInputComponent],
  templateUrl: './recover-otp.html',
  styleUrl: './recover-otp.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoverOtp {
  readonly authModeStore = inject(AuthModeStore);
  readonly authService = inject(AuthService);
  readonly isResending = signal(false);

  readonly i18n = authI18n['recover-otp'];

  readonly otpInput = viewChild(OtpInputComponent);

  async onVerified(code: string): Promise<void> {
    const email = this.authModeStore.recoverEmail();
    try {
      await lastValueFrom(this.authService.verifyOtpCode(email, code));
      await this.otpInput()?.confirmSuccess();
      this.authModeStore.goToPasswordStep(code);
    } catch {
      this.otpInput()?.triggerError();
    }
  }

  async onResend(): Promise<void> {
    this.isResending.set(true);
    try {
      await lastValueFrom(this.authService.sendEmailRecovery(this.authModeStore.recoverEmail()));
    } finally {
      this.isResending.set(false);
    }
  }
}
