import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
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

  constructor() {
    afterNextRender(() => this.runIntro());
  }

  private runIntro(): void {
    const borderEl = this.borderRef().nativeElement;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from(borderEl, {
      drawSVG: '50% 50%',
      duration: 1.4,
      ease: 'power2.inOut',
    });

    tl.from(
      '.header__brand, .header__actions > *',
      {
        autoAlpha: 0,
        y: -8,
        duration: 0.4,
        stagger: 0.06,
      },
      '<0.1',
    );

    this.destroyRef.onDestroy(() => tl.kill());
  }
}
