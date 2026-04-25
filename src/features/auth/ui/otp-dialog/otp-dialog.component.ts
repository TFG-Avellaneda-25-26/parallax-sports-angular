import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@entities/auth';
import { UserStore } from '@entities/user';
import { gsap } from '@shared/lib';
import { lastValueFrom } from 'rxjs';
import { NgOtpInputModule } from 'ng-otp-input';

type OtpState = 'idle' | 'verifying' | 'success' | 'error';

const CELL_COUNT = 6;
const CELL_SIZE = 52;
const CELL_GAP = 10;
const TOTAL_WIDTH = CELL_COUNT * CELL_SIZE + (CELL_COUNT - 1) * CELL_GAP;

@Component({
  selector: 'app-otp-dialog',
  imports: [ReactiveFormsModule, NgOtpInputModule],
  templateUrl: './otp-dialog.component.html',
  styleUrl: './otp-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpDialogComponent {
  protected readonly verified = output<void>();
  protected readonly closed = output<void>();

  private readonly authService = inject(AuthService);
  private readonly userStore = inject(UserStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cellsLayerRef = viewChild.required<ElementRef<SVGSVGElement>>('cellsLayer');

  protected readonly state = signal<OtpState>('idle');
  protected readonly isResending = signal(false);
  protected readonly resendError = signal(false);

  protected readonly otpForm = new FormGroup({
    code: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(CELL_COUNT),
        Validators.maxLength(CELL_COUNT),
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

  /** Visually hidden status line for assistive tech. */
  protected readonly statusMessage = computed(() => {
    if (this.isResending()) return 'Resending verification email.';
    if (this.resendError()) return 'Could not resend the verification email. Please try again.';

    switch (this.state()) {
      case 'verifying':
        return 'Verifying your code, please wait.';
      case 'success':
        return 'Code verified successfully.';
      case 'error':
        return 'The code is invalid. Please try again.';
      default: {
        const code = this.otpForm.controls.code;
        if (code.touched && code.invalid && !code.errors?.['verifyError']) {
          return 'Enter the 6-digit verification code.';
        }
        return '';
      }
    }
  });


  private readonly animations: gsap.core.Animation[] = [];

  constructor() {
    afterNextRender(() => this.runIntro());
    this.destroyRef.onDestroy(() => this.killAnimations());
  }

  protected async verify(): Promise<void> {
    if (!this.otpForm.valid || this.state() === 'verifying') return;

    this.state.set('verifying');
    const code = this.otpForm.controls.code.value;

    try {
      await lastValueFrom(this.authService.verifyEmail(code));
      this.userStore.markEmailVerified();
      await this.playSuccess();
      this.verified.emit();
    } catch {
      this.otpForm.setErrors({ verifyError: true });
      this.otpForm.controls.code.markAsTouched();
      this.playError();
    }
  }

  protected async resend(): Promise<void> {
    if (this.isResending()) return;

    this.isResending.set(true);
    this.resendError.set(false);

    try {
      await lastValueFrom(this.authService.resendVerification());
      this.otpForm.reset();
    } catch {
      this.resendError.set(true);
    } finally {
      this.isResending.set(false);
    }
  }

  protected close(): void {
    this.closed.emit();
  }

  // ANIMATIONS

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
    const tl = this.track(gsap.timeline());

    tl.from(rects, {
      drawSVG: 0,
      duration: 1.6,
      stagger: 0.14,
      ease: 'power2.inOut',
    });

    tl.from(
      '.otp-cells__action',
      {
        autoAlpha: 0,
        scale: 0.6,
        duration: 0.4,
        stagger: 0.06,
        ease: 'back.out(1.6)',
      },
      '<0.5',
    );
  }

  private playError(): void {
    const rects = this.getRects();
    const wrap = this.cellsLayerRef().nativeElement.parentElement;

    this.state.set('error');

    this.track(
      gsap.to(rects, {
        stroke: 'var(--color-error)',
        duration: 0.25,
        ease: 'power2.out',
      }),
    );

    if (wrap) {
      this.track(
        gsap.fromTo(
          wrap,
          { x: -8 },
          {
            x: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)',
          },
        ),
      );
    }

    this.track(
      gsap.to(rects, {
        stroke: 'var(--color-border)',
        duration: 0.6,
        delay: 1.4,
        ease: 'power2.inOut',
        onComplete: () => {
          if (this.state() === 'error') this.state.set('idle');
          this.otpForm.setErrors(null);
        },
      }),
    );
  }

  private playSuccess(): Promise<void> {
    const rects = this.getRects();
    this.state.set('success');

    return new Promise((resolve) => {
      const tl = this.track(
        gsap.timeline({
          onComplete: () => resolve(),
          onInterrupt: () => resolve(),
        }),
      );
      tl.to(rects, {
        stroke: 'var(--color-success)',
        duration: 0.3,
        ease: 'power2.out',
      });
      tl.to(
        rects,
        {
          autoAlpha: 0,
          duration: 0.55,
          stagger: 0.04,
          ease: 'power2.in',
        },
        '+=0.3',
      );
    });
  }
}
