import { Component, ElementRef, DestroyRef, afterNextRender, inject, viewChild } from '@angular/core';
import { ThemeStore } from '@shared/stores';
import { gsap } from '@shared/lib';

const SUN_PATH = `m 11,0 a 1,1 0 0 0 -1,1 v 2 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 V 1 A 1,1 0 0 0 11,0 Z M 3.9296875,2.9296875 a 1,1 0 0 0 -0.7070313,0.2929687 1,1 0 0 0 0,1.4140626 L 4.6328125,6.046875 a 1,1 0 0 0 1.4140625,0 1,1 0 0 0 0,-1.4140625 L 4.6367188,3.2226562 A 1,1 0 0 0 3.9296875,2.9296875 Z m 14.1406245,0 a 1,1 0 0 0 -0.707031,0.2929687 l -1.410156,1.4101563 a 1,1 0 0 0 0,1.4140625 1,1 0 0 0 1.414063,0 l 1.410156,-1.4101562 a 1,1 0 0 0 0,-1.4140626 1,1 0 0 0 -0.707032,-0.2929687 z M 11,6 c -2.7495791,0 -5,2.2504209 -5,5 0,2.749579 2.2504209,5 5,5 2.749579,0 5,-2.250421 5,-5 0,-2.7495791 -2.250421,-5 -5,-5 z m 0,2 c 1.668699,0 3,1.3313011 3,3 0,1.668699 -1.331301,3 -3,3 C 9.3313011,14 8,12.668699 8,11 8,9.3313011 9.3313011,8 11,8 Z M 1,10 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 H 3 A 1,1 0 0 0 4,11 1,1 0 0 0 3,10 Z m 18,0 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 2 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z M 5.3398438,15.660156 a 1,1 0 0 0 -0.7070313,0.292969 l -1.4101563,1.410156 a 1,1 0 0 0 0,1.414063 1,1 0 0 0 1.4140626,0 L 6.046875,17.367188 a 1,1 0 0 0 0,-1.414063 1,1 0 0 0 -0.7070312,-0.292969 z m 11.3203122,0 a 1,1 0 0 0 -0.707031,0.292969 1,1 0 0 0 0,1.414063 l 1.410156,1.410156 a 1,1 0 0 0 1.414063,0 1,1 0 0 0 0,-1.414063 L 17.367188,15.953125 A 1,1 0 0 0 16.660156,15.660156 Z M 11,18 a 1,1 0 0 0 -1,1 v 2 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 v -2 a 1,1 0 0 0 -1,-1 z`;
const MOON_PATH = `m 9.5797441,5.1556498e-4 c -0.03751,-0.00124 -0.07535,-1.073e-4 -0.113281,0.001949995 C 5.1849675,0.23404786 1.9829984,2.9818615 0.66958825,6.4126249 -0.64382185,9.8433887 -0.09465565,14.027608 2.9371665,17.05911 c 3.031822,3.031502 7.2158595,3.58135 10.6464845,2.267578 3.429552,-1.313362 6.177529,-4.517366 6.410156,-8.796875 v -0.002 -0.002 a 1,1 0 0 0 -0.002,-0.0059 C 20.020587,9.9170877 19.621553,9.3571997 19.159776,9.1371007 18.695854,8.9159787 18.136042,8.9265887 17.661729,9.2230407 15.345521,10.670699 13.005346,10.04908 11.476182,8.5199157 9.9470651,6.9908832 9.3234461,4.6505768 10.771104,2.3343689 11.069114,1.8589391 11.078451,1.2977438 10.857044,0.83436886 10.649516,0.40008596 10.1424,0.01917206 9.5797441,5.1556498e-4 Z M 8.7125571,2.1743437 c -1.2807234,2.8408522 -0.548941,5.861215 1.3496089,7.759766 1.898169,1.8981693 4.917456,2.6311733 7.757813,1.3515623 -0.484917,3.014544 -2.434922,5.208267 -4.951172,6.171875 -2.763192,1.058176 -6.0437987,0.661018 -8.517578,-1.8125 C 1.8774497,13.171529 1.4788913,9.8907727 2.5367759,7.1274687 3.5005278,4.6100486 5.696049,2.6584737 8.7125571,2.1743437 Z`;

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  templateUrl: './theme-toogle.html',
  styleUrl: './theme-toogle.css',
})
export class ThemeToggleComponent {
  protected readonly themeStore = inject(ThemeStore);
  private readonly iconPathRef = viewChild.required<ElementRef>('iconPath');
  private readonly destroyRef = inject(DestroyRef);

  protected readonly sunPath  = SUN_PATH;
  protected readonly moonPath = MOON_PATH;
  protected readonly initialIsDark = this.themeStore.isDark();

  private morphTween: gsap.core.Tween | null = null;

  constructor() {
    afterNextRender(() => this.init());
  }

  private init(): void {
    this.destroyRef.onDestroy(() => this.morphTween?.kill());
  }

  protected onToggleTheme(): void {
    const iconPath = this.iconPathRef().nativeElement as SVGPathElement;
    const targetId = this.themeStore.isDark() ? '#theme-icon-moon' : '#theme-icon-sun';

    this.morphTween?.kill();
    this.morphTween = gsap.to(iconPath, {
      morphSVG: targetId,
      duration: 0.4,
      ease: 'power2.inOut',
    });

    this.themeStore.toggleTheme();
  }
}
