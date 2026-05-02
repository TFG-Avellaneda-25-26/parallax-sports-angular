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

  type = input<'text' | 'email' | 'password'>('text');
  label = input<string>('');
  fieldId = input<string>('');

  protected readonly passwordVisible = signal(false);
  protected readonly effectiveType = computed(() =>
    this.type() === 'password' && this.passwordVisible() ? 'text' : this.type()
  );
  protected readonly eyeClosedPath = EYE_CLOSED_PATH;

  private readonly eyePathRef = viewChild<ElementRef<SVGPathElement>>('eyePath');
  private readonly destroyRef = inject(DestroyRef);
  private morphTween: gsap.core.Tween | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.morphTween?.kill());
  }

  protected toggleVisibility(): void {
    const path = this.eyePathRef()?.nativeElement;
    if (!path) return;

    this.passwordVisible.update((v) => !v);
    const target = this.passwordVisible() ? EYE_OPEN_PATH : EYE_CLOSED_PATH;

    this.morphTween?.kill();
    this.morphTween = gsap.to(path, {
      morphSVG: target,
      duration: 0.4,
      ease: 'power2.inOut',
    });
  }
}
