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
import { Router } from '@angular/router';
import { ErrorStore } from '@shared/stores';
import { gsap } from '@shared/lib';

@Component({
  selector: 'app-error-display',
  templateUrl: './error-display.html',
  styleUrl: './error-display.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorDisplay {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly errorStore = inject(ErrorStore);

  readonly statusText = computed(() => {
    const status = this.errorStore.status();
    return status === null || status === 0 ? '???' : String(status);
  });

  readonly invalidParams = computed(() => {
    const params = this.errorStore.error()?.['invalid_params'];
    return Array.isArray(params) ? params as { name: string; reason: string }[] : [];
  });

  private readonly svgRef = viewChild<ElementRef<SVGSVGElement>>('svgRef');
  private readonly leftRef = viewChild<ElementRef<SVGGElement>>('leftRef');
  private readonly rightRef = viewChild<ElementRef<SVGGElement>>('rightRef');

  constructor() {
    afterNextRender(() => {
      if (typeof window === 'undefined') return;
      const isDesktop = window.matchMedia(
        '(min-width: 1024px) and (hover: hover) and (pointer: fine)'
      ).matches;
      if (!isDesktop) return;

      const svgEl = this.svgRef()?.nativeElement;
      const leftEl = this.leftRef()?.nativeElement;
      const rightEl = this.rightRef()?.nativeElement;
      if (!svgEl || !leftEl || !rightEl) return;

      gsap.from(svgEl, {
        filter: 'blur(20px)',
        opacity: 0,
        scale: 0.96,
        duration: 1.4,
        ease: 'power2.out',
      });

      const halves = [leftEl, rightEl];
      const tl = gsap.timeline({
        defaults: { duration: 2, yoyo: true, ease: 'power2.inOut' },
        paused: true,
      }).fromTo(halves, {
        svgOrigin: '800 350',
        skewY: (i: number) => [-30, 15][i],
        scaleX: (i: number) => [0.6, 0.85][i],
      }, {
        skewY: (i: number) => [-15, 30][i],
        scaleX: (i: number) => [0.85, 0.6][i],
      });
      tl.progress(0);

      const texts = Array.from(svgEl.querySelectorAll('text')) as SVGTextElement[];
      const tl2 = gsap.timeline({ paused: true });
      texts.forEach((t) => {
        const halfWidth = t.getBBox().width / 2;
        tl2.fromTo(
          t,
          { x: -halfWidth },
          { x: halfWidth, duration: 1, ease: 'sine.inOut' },
          0,
        );
      });
      tl2.progress(0);

      let mouseActive = false;
      const unlockTimer = setTimeout(() => { mouseActive = true; }, 2000);

      const onPointerMove = (e: PointerEvent) => {
        if (!mouseActive) return;
        gsap.to([tl, tl2], {
          duration: 0.50,
          ease: 'power4',
          progress: e.clientX / window.innerWidth,
        });
      };
      window.addEventListener('pointermove', onPointerMove, { passive: true });

      this.destroyRef.onDestroy(() => {
        clearTimeout(unlockTimer);
        window.removeEventListener('pointermove', onPointerMove);
        tl.kill();
        tl2.kill();
      });
    });
  }

  goHome(): void {
    void this.router.navigate(['/']).then(() => this.errorStore.clear());
  }
}
