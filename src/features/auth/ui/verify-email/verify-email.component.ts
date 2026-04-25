import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  Injector,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { gsap } from '@shared/lib';
import { OtpDialogComponent } from '../otp-dialog/otp-dialog.component';

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

@Component({
  selector: 'app-verify-email',
  imports: [OtpDialogComponent],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailComponent {
  protected readonly isOpen = signal(false);

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly badgeRef = viewChild<ElementRef<HTMLElement>>('badge');
  private readonly backdropRef = viewChild<ElementRef<HTMLElement>>('backdrop');
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  private storedBadgeRect: DOMRect | null = null;
  private previouslyFocused: HTMLElement | null = null;
  private activeTweens: gsap.core.Tween[] = [];

  constructor() {
    this.destroyRef.onDestroy(() => this.killTweens());
  }

  protected openModal(): void {
    if (this.isOpen()) return;

    const badge = this.badgeRef()?.nativeElement;
    if (!badge) {
      this.isOpen.set(true);
      return;
    }

    this.storedBadgeRect = badge.getBoundingClientRect();
    this.previouslyFocused = (document.activeElement as HTMLElement | null) ?? badge;
    this.isOpen.set(true);

    afterNextRender(
      () => {
        const panel = this.panelRef()?.nativeElement;
        const backdrop = this.backdropRef()?.nativeElement;
        if (!panel || !backdrop || !this.storedBadgeRect) return;

        this.killTweens();

        const panelRect = panel.getBoundingClientRect();
        const { dx, dy, sx, sy } = this.computeTransform(this.storedBadgeRect, panelRect);

        this.activeTweens.push(
          gsap.fromTo(
            panel,
            {
              x: dx,
              y: dy,
              scaleX: sx,
              scaleY: sy,
              autoAlpha: 0.2,
              transformOrigin: 'center center',
            },
            {
              x: 0,
              y: 0,
              scaleX: 1,
              scaleY: 1,
              autoAlpha: 1,
              duration: 0.7,
              ease: 'power3.inOut',
              onComplete: () => this.moveFocusIntoPanel(panel),
            },
          ),
          gsap.fromTo(
            backdrop,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.45, ease: 'power2.out' },
          ),
        );
      },
      { injector: this.injector },
    );
  }

  protected closeModal(): void {
    if (!this.isOpen()) return;

    const panel = this.panelRef()?.nativeElement;
    const backdrop = this.backdropRef()?.nativeElement;

    if (!panel || !backdrop || !this.storedBadgeRect) {
      this.isOpen.set(false);
      this.restoreFocus();
      return;
    }

    this.killTweens();

    const panelRect = panel.getBoundingClientRect();
    const { dx, dy, sx, sy } = this.computeTransform(this.storedBadgeRect, panelRect);

    const closeTween = gsap.to(panel, {
      x: dx,
      y: dy,
      scaleX: sx,
      scaleY: sy,
      autoAlpha: 0,
      duration: 0.5,
      ease: 'power3.inOut',
      transformOrigin: 'center center',
      onComplete: () => {
        this.isOpen.set(false);
        this.restoreFocus();
      },
    });

    const fadeBackdrop = gsap.to(backdrop, {
      autoAlpha: 0,
      duration: 0.45,
      ease: 'power2.in',
    });

    this.activeTweens.push(closeTween, fadeBackdrop);
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.backdropRef()?.nativeElement) {
      this.closeModal();
    }
  }

  /**
   * Trap focus inside the panel while the modal is open. Wrapping Tab from
   * the last focusable element back to the first (and vice-versa) keeps
   * keyboard users from tabbing into the page behind the backdrop.
   */
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
    this.closeModal();
  }

  private computeTransform(
    fromRect: DOMRect,
    toRect: DOMRect,
  ): { dx: number; dy: number; sx: number; sy: number } {
    const fromCx = fromRect.left + fromRect.width / 2;
    const fromCy = fromRect.top + fromRect.height / 2;
    const toCx = toRect.left + toRect.width / 2;
    const toCy = toRect.top + toRect.height / 2;
    return {
      dx: fromCx - toCx,
      dy: fromCy - toCy,
      sx: fromRect.width / toRect.width,
      sy: fromRect.height / toRect.height,
    };
  }

  private moveFocusIntoPanel(panel: HTMLElement): void {
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
      return;
    }
    // The badge is re-rendered after isOpen flips back to false, so query
    // for it after the next paint and focus that instead.
    afterNextRender(
      () => this.badgeRef()?.nativeElement?.focus(),
      { injector: this.injector },
    );
  }

  private killTweens(): void {
    this.activeTweens.forEach((t) => t.kill());
    this.activeTweens = [];
  }
}
