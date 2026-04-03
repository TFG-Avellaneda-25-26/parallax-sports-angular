import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `<div class="spinner"></div>`,
  styles: `
    .spinner {
      width: 2rem;
      height: 2rem;
      border: 3px solid rgba(0, 0, 0, 0.1);
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `,
})
export class SpinnerComponent {}
