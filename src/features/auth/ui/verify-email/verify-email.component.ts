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
      onComplete: () => this.isOpen.set(false),
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

  private killTweens(): void {
    this.activeTweens.forEach((t) => t.kill());
    this.activeTweens = [];
  }
}
