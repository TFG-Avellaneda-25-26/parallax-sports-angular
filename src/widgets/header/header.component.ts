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

@Component({
  selector: 'app-header',
  imports: [RouterLink, ThemeToggleComponent, LogoutButtonComponent, VerifyEmailComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly userStore = inject(UserStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly borderRef = viewChild.required<ElementRef<SVGPathElement>>('borderPath');

  // Local computed signal that aggregates the cross-component @ngrx
  // signalStore signals. Reading a *local* computed in the OnPush template
  // makes Angular's reactive CD reliably re-render this component when either
  // source flips — works around a quirk in zoneless + OnPush where store
  // signals read across component boundaries can miss the first update.
  protected readonly shouldShowVerifyBadge = computed(
    () => this.userStore.isAuthenticated() && !this.userStore.isVerified(),
  );

  constructor() {
    afterNextRender(() => this.runIntro());
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
