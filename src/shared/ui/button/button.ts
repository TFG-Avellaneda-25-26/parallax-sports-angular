import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button [type]="type()" [disabled]="disabled()">
      <ng-content />
    </button>
  `,
  styles: `
    button {
      cursor: pointer;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.375rem;
      font-weight: 500;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
})
export class ButtonComponent {
  type = input<'button' | 'submit'>('button');
  disabled = input(false);
}
