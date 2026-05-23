import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { VerifyEmailService } from '@features/auth/services/verify-email.service';

/**
 * Thin trigger that lives in the header. Clicking the badge opens the global
 * VerifyEmailDialogComponent (mounted once in app.html). All modal state lives
 * in VerifyEmailService; this component just shows the badge and fires open().
 */
@Component({
  selector: 'app-verify-email',
  imports: [],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailComponent {
  private readonly service = inject(VerifyEmailService);
  private readonly badgeRef = viewChild<ElementRef<HTMLElement>>('badge');

  protected readonly isOpen = this.service.isOpen;

  protected openModal(): void {
    const rect = this.badgeRef()?.nativeElement?.getBoundingClientRect() ?? null;
    this.service.open(rect);
  }
}
