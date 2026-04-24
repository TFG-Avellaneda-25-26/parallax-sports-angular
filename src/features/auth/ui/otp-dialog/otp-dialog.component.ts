import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@entities/auth';
import { UserStore } from '@entities/user';
import { lastValueFrom } from 'rxjs';
import { NgOtpInputModule } from 'ng-otp-input'

@Component({
  selector: 'app-otp-dialog',
  imports: [ReactiveFormsModule, NgOtpInputModule],
  templateUrl: './otp-dialog.component.html',
  styleUrl: './otp-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpDialogComponent {

  verified = output<void>();

  readonly authService = inject(AuthService);
  readonly userStore = inject(UserStore);

  otpForm = new FormGroup({
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.pattern(/^\d+$/)
    ])
  });

  async verify() {
    if (this.otpForm.valid) {
      const code = this.otpForm.controls.code.value!;

      try {
        await lastValueFrom(this.authService.verifyEmail(code));
        this.userStore.markEmailVerified();

        this.verified.emit();
      } catch {
        this.otpForm.setErrors({ verifyError: true });
      }
    }
  }
}
