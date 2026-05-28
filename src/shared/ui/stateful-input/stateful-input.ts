import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { gsap } from '@shared/lib';

const EYE_OPEN_PATH =
  'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z';
const EYE_CLOSED_PATH =
  'M15 18L14.278 14.75M2 8a10.645 10.645 0 0 0 20 0M20 15L18.274 12.95M4 15L5.726 12.95M9 18L9.722 14.75';

const DECODE_CHARS = '01!@#$%^&*+=/?ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
const DECODE_DURATION = 0.55;

@Component({
  selector: 'app-stateful-input',
  imports: [],
  templateUrl: './stateful-input.html',
  styleUrl: './stateful-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatefulInput {
  value = model<string>('');
  touched = model<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  readonly = input<boolean>(false);

  type = input<'text' | 'email' | 'password'>('text');
  label = input<string>('');
  fieldId = input<string>('');

  protected readonly passwordVisible = signal(false);
  protected readonly decoding = signal(false);
  protected readonly effectiveType = computed(() =>
    this.type() === 'password' && this.passwordVisible() ? 'text' : this.type()
  );
  protected readonly eyeClosedPath = EYE_CLOSED_PATH;

  private readonly eyePathRef = viewChild<ElementRef<SVGPathElement>>('eyePath');
  private readonly decodeRef = viewChild<ElementRef<HTMLSpanElement>>('decodeOverlay');
  private readonly destroyRef = inject(DestroyRef);
  private morphTween: gsap.core.Tween | null = null;
  private decodeTween: gsap.core.Tween | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.morphTween?.kill();
      this.decodeTween?.kill();
    });
  }

  protected toggleVisibility(): void {
    const path = this.eyePathRef()?.nativeElement;
    if (!path) return;

    const willReveal = !this.passwordVisible();
    this.passwordVisible.set(willReveal);

    const target = willReveal ? EYE_OPEN_PATH : EYE_CLOSED_PATH;
    this.morphTween?.kill();
    this.morphTween = gsap.to(path, {
      morphSVG: target,
      duration: 0.4,
      ease: 'power2.inOut',
    });

    this.runDecodeAnimation(willReveal);
  }

  // Plays a Matrix-style scramble on a span overlaid on the input while the
  // password value is being shown/hidden. The actual <input>'s value is never
  // touched — we just hide its rendered text via `is-decoding` for the
  // duration of the tween so the overlay reads cleanly on top.
  private runDecodeAnimation(willReveal: boolean): void {
    const overlay = this.decodeRef()?.nativeElement;
    if (!overlay) return;

    const realValue = this.value() ?? '';
    if (!realValue) return;

    const startText = willReveal ? this.randomMask(realValue.length) : realValue;
    const endText = willReveal ? realValue : this.randomMask(realValue.length);

    this.decodeTween?.kill();
    overlay.textContent = startText;
    this.decoding.set(true);

    // `chars` + `speed` are real TextPlugin options but the bundled .d.ts
    // only exposes `value`, so we widen. Same idiom is used in
    // src/widgets/header/header.component.ts.
    const textOptions = { value: endText, chars: DECODE_CHARS, speed: 0.4 } as unknown as { value: string };

    this.decodeTween = gsap.to(overlay, {
      duration: DECODE_DURATION,
      text: textOptions,
      ease: 'none',
      onComplete: () => this.decoding.set(false),
    });
  }

  private randomMask(length: number): string {
    let out = '';
    for (let i = 0; i < length; i++) {
      out += DECODE_CHARS[Math.floor(Math.random() * DECODE_CHARS.length)];
    }
    return out;
  }
}
