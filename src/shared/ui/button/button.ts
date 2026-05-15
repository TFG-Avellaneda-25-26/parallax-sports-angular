import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button class="cta-btn" [type]="type()" [disabled]="disabled()">
      <ng-content />
    </button>
  `,
  styles: `
    :host { display: inline-flex; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  type = input<'button' | 'submit'>('button');
  disabled = input(false);
}
