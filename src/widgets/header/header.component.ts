import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserStore } from '@entities/user';
import { LogoutButtonComponent, VerifyEmailComponent } from '@features/auth';
import { ThemeToggleComponent } from '@features/theme-switch';
import { gsap } from '@shared/lib';
import { LogoComponent } from '@shared/ui';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ThemeToggleComponent, LogoutButtonComponent, VerifyEmailComponent, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly userStore = inject(UserStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly borderRef = viewChild.required<ElementRef<SVGPathElement>>('borderPath');
  private readonly settingsLabelRef = viewChild<ElementRef<HTMLSpanElement>>('settingsLabel');
  private verifyTween: ReturnType<typeof gsap.timeline> | null = null;

  // Local computed signal that aggregates the cross-component @ngrx
  // signalStore signals. Reading a *local* computed in the OnPush template
  // makes Angular's reactive CD reliably re-render this component when either
  // source flips — works around a quirk in zoneless + OnPush where store
  // signals read across component boundaries can miss the first update.
  protected readonly shouldShowVerifyBadge = computed(
    () => this.userStore.isAuthenticated() && !this.userStore.isVerified(),
  );

  protected readonly shouldShowAuthActions = computed(
    () => this.userStore.isAuthenticated(),
  );

  constructor() {
    afterNextRender(() => this.runIntro());
  }

  protected onSettingsClick(event: MouseEvent): void {
    if (this.userStore.isVerified()) {
      // Let routerLink handle navigation.
      return;
    }
    event.preventDefault();

    const labelEl = this.settingsLabelRef()?.nativeElement;
    if (!labelEl) return;

    // Restart cleanly on re-click.
    this.verifyTween?.kill();
    labelEl.textContent = 'Settings';

    // `chars` + `speed` are real TextPlugin options (per the GSAP docs)
    // but the bundled .d.ts only exposes `value`, so we widen here.
    const decodeTo = (value: string) => ({ value, chars: '01', speed: 0.4 } as unknown as { value: string });

    const tl = gsap.timeline();
    tl.to(labelEl, {
      duration: 1.2,
      text: decodeTo('VERIFY!'),
      ease: 'none',
    }).to(
      labelEl,
      {
        duration: 1.0,
        text: decodeTo('Settings'),
        ease: 'none',
      },
      '+=0.6',
    );

    this.verifyTween = tl;
    this.destroyRef.onDestroy(() => tl.kill());
  }

private runIntro(): void {
  const borderEl = this.borderRef().nativeElement;

  const tl = gsap.timeline();

  gsap.set(borderEl, {
    transformOrigin: '50% 50%',
    transformBox: 'fill-box',
    scaleX: 0,
  });

  tl.to(borderEl, { scaleX: 1, duration: 1.4, ease: 'power2.inOut' });



  this.destroyRef.onDestroy(() => tl.kill());
}
}
