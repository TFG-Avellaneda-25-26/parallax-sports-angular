import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { gsap } from '@shared/lib';

type OtpState = 'idle' | 'verifying' | 'success' | 'error';

const CELL_COUNT = 6;
const CELL_SIZE = 52;
const CELL_GAP = 10;
const TOTAL_WIDTH = CELL_COUNT * CELL_SIZE + (CELL_COUNT - 1) * CELL_GAP;

@Component({
  selector: 'app-otp-input',
  imports: [ReactiveFormsModule, NgOtpInputModule],
  templateUrl: './otp-input.component.html',
  styleUrl: './otp-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpInputComponent {
  readonly verified = output<string>();
  readonly resendRequested = output<void>();
  readonly closed = output<void>();

  readonly showClose = input<boolean>(true);
  readonly showResend = input<boolean>(true);
  readonly isResending = input<boolean>(false);

  private readonly destroyRef = inject(DestroyRef);
  private readonly cellsLayerRef = viewChild.required<ElementRef<SVGSVGElement>>('cellsLayer');

  protected readonly state = signal<OtpState>('idle');

  protected readonly otpForm = new FormGroup({
    code: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern(/^\d+$/),
      ],
    }),
  });

  protected readonly cells = Array.from({ length: CELL_COUNT });
  protected readonly cellSize = CELL_SIZE;
  protected readonly cellGap = CELL_GAP;
  protected readonly totalWidth = TOTAL_WIDTH;
  protected readonly cellSizePx = `${CELL_SIZE}px`;
  protected readonly totalWidthPx = `${TOTAL_WIDTH}px`;

  protected readonly otpConfig = {
    length: CELL_COUNT,
    allowNumbersOnly: true,
  };

  protected readonly statusMessage = computed(() => {
    if (this.isResending()) return 'Resending code...';
    switch (this.state()) {
      case 'verifying': return 'Verifying your code, plaese wait...';
      case 'success': return 'Code verified successfully!';
      case 'error': return 'Invalid code, please try again.';
      default: return '';
    }
  });

  private readonly animations: gsap.core.Animation[] = [];

  constructor() {
    afterNextRender(() => this.runIntro());
    this.destroyRef.onDestroy(() => this.killAnimations());
  }

  protected async verify(): Promise<void> {
    if (!this.otpForm.valid || this.state() === 'verifying') return;

    const code = this.otpForm.controls.code.value;
    this.state.set('verifying');
    this.verified.emit(code);
  }

  async confirmSuccess(): Promise<void> {
    await this.playSuccess();
  }

  protected close(): void {
    this.closed.emit();
  }

  protected resend(): void {
    this.resendRequested.emit();
  }

  triggerError(): void {
    const rects = this.getRects();
    gsap.set(rects, { autoAlpha: 1, stroke: 'var(--color-border)' });

    this.state.set('idle');
    this.otpForm.setErrors({ verifyError: true });
    this.otpForm.controls.code.markAsTouched();
    this.playError();
  }

  private getRects(): SVGRectElement[] {
    return Array.from(
      this.cellsLayerRef().nativeElement.querySelectorAll<SVGRectElement>('.otp-cells__rect'),
    );
  }

  private track<T extends gsap.core.Animation>(animation: T): T {
    this.animations.push(animation);
    return animation;
  }

  private killAnimations(): void {
    this.animations.forEach((a) => a.kill());
    this.animations.length = 0;
  }

  private runIntro(): void {
    const rects = this.getRects();
    const t1 = this.track(gsap.timeline());
    t1.from(rects, {
      drawSVG: 0,
      duration: 0.85,
      stagger: 0.10,
      ease: 'power2.out',
    }, '<0.4');
  }

  private playError(): void {
    const rects = this.getRects();
    const wrap = this.cellsLayerRef().nativeElement.parentElement;

    this.state.set('error');

    this.track(gsap.to(rects, {
      stroke: 'var(--color-error)',
      duration: 0.25,
      ease: 'power2.out',
    }));

    if (wrap) {
      this.track(gsap.fromTo(wrap, { x: -8 }, {
        x: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      }));
    }

    this.track(gsap.to(rects, {
      stroke: 'var(--color-border)',
      duration: 0.6,
      delay: 1.4,
      ease: 'power2.inOut',
      onComplete: () => {
        if (this.state() === 'error') this.state.set('idle');
        this.otpForm.setErrors(null);
      }
    }));
  }

  private playSuccess(): Promise<void> {
    const rects = this.getRects();
    this.state.set('success');

    return new Promise((resolve) => {
      const tl = this.track(gsap.timeline({
        onComplete: () => resolve(),
        onInterrupt: () => resolve(),
      }));
      tl.to(rects, {
        stroke: 'var(--color-success)',
        duration: 0.3,
        ease: 'power2.out',
      });
      tl.to(rects, {
        autoAlpha: 0,
        duration: 0.55,
        stagger: 0.04,
        ease: 'power2.in',
      }, '+=0.3');
    });
  }
}
