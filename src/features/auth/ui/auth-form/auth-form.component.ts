import { Component, inject, ChangeDetectionStrategy, viewChild, ElementRef } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { AuthStore } from '@features/auth/store/auth.store';
import { StatefulInput } from '@shared/ui';
import { gsap, Flip } from '@shared/lib';

@Component({
  selector: 'app-auth-form',
  imports: [FormField, FormRoot, StatefulInput],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormComponent {
  readonly authStore = inject(AuthStore);
  readonly form = this.authStore.authForm;
  readonly formRef = viewChild<ElementRef<HTMLFormElement>>('formRef');

  switchMode(): void {
    const formEl = this.formRef()?.nativeElement;
    const state = Flip.getState('.field');
    const fromHeight = formEl?.offsetHeight ?? 0;

    this.authStore.toggleMode();

    requestAnimationFrame(() => {
      const toHeight = formEl?.offsetHeight ?? 0;

      if (formEl && fromHeight !== toHeight) {
        gsap.fromTo(formEl,
          { height: fromHeight },
          { height: toHeight, duration: 0.45, ease: 'power2.inOut', clearProps: 'height' }
        );
      }

      Flip.from(state, {
        targets: '.field',
        duration: 0.55,
        ease: 'power3.inOut',
        absoluteOnLeave: true,
        prune: true,
        stagger: 0.04,
        onEnter: (elements) =>
          gsap.fromTo(elements,
            { opacity: 0, y: -18, scale: 0.92, filter: 'blur(6px)' },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              duration: 0.5,
              ease: 'back.out(1.6)',
              stagger: 0.07,
            }
          ),
        onLeave: (elements) =>
          gsap.to(elements, {
            opacity: 0,
            scale: 0.94,
            filter: 'blur(4px)',
            duration: 0.22,
            ease: 'power2.in',
          }),
      });
    });
  }
}
