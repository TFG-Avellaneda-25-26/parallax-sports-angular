import { ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { OtpDialogComponent } from '../otp-dialog/otp-dialog.component'

@Component({
  selector: 'app-verify-email',
  imports: [OtpDialogComponent],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailComponent {
  otpModal = viewChild<ElementRef<HTMLDialogElement>>('otpModal');

  openModal() {
    this.otpModal()?.nativeElement.showModal();
  }

  closeModal() {
    this.otpModal()?.nativeElement.close();
  }
}
