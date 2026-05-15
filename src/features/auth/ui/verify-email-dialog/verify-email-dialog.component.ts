import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  Injector,
  afterNextRender,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { gsap } from '@shared/lib';
import { OtpDialogComponent } from '../otp-dialog/otp-dialog.component';
import { VerifyEmailService } from '../../services/verify-email.service';

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

@Component({
  selector: 'app-verify-email-dialog',
  imports: [OtpDialogComponent],
  templateUrl: './verify-email-dialog.component.html',
  styleUrl: './verify-email-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailDialogComponent {
  private readonly service = inject(VerifyEmailService);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly backdropRef = viewChild<ElementRef<HTMLElement>>('backdrop');
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  protected readonly isOpen = this.service.isOpen;

  private previouslyFocused: HTMLElement | null = null;
  private activeTweens: gsap.core.Tween[] = [];

  constructor() {
    effect(() => {
      const open = this.isOpen();
      // eslint-disable-next-line no-console
      console.debug('[VerifyEmailDialog] isOpen ->', open);
      if (open) {
        this.previouslyFocused = (document.activeElement as HTMLElement | null) ?? null;
        afterNextRender(() => this.focusPanel(), { injector: this.injector });
      }
    });

    this.destroyRef.onDestroy(() => this.killTweens());
  }

  protected closeModal(): void {
    if (!this.isOpen()) return;

    const panel = this.panelRef()?.nativeElement;
    const backdrop = this.backdropRef()?.nativeElement;

    const finish = () => {
      this.service.close();
      this.restoreFocus();
    };

    if (!panel || !backdrop) {
      finish();
      return;
    }

    this.killTweens();

    this.activeTweens.push(
      gsap.to(panel, {
        scale: 0.94,
        autoAlpha: 0,
        duration: 0.18,
        ease: 'power2.in',
        onComplete: finish,
      }),
      gsap.to(backdrop, {
        autoAlpha: 0,
        duration: 0.18,
        ease: 'power2.in',
      }),
    );
  }

  protected onPanelKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const panel = this.panelRef()?.nativeElement;
    if (!panel) return;

    const focusables = Array.from(
      panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1);

    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.isOpen()) this.closeModal();
  }

  private focusPanel(): void {
    const panel = this.panelRef()?.nativeElement;
    if (!panel) return;
    const firstInput = panel.querySelector<HTMLElement>('input.otp-input');
    if (firstInput) {
      firstInput.focus();
      return;
    }
    const fallback = panel.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    fallback?.focus();
  }

  private restoreFocus(): void {
    const target = this.previouslyFocused;
    this.previouslyFocused = null;
    if (target && document.contains(target)) {
      target.focus();
    }
  }

  private killTweens(): void {
    this.activeTweens.forEach((t) => t.kill());
    this.activeTweens = [];
  }
}
