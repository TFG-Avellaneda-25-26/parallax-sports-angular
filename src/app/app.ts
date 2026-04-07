import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiClient } from '@shared/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('temp-name');

  private api = inject(ApiClient);

  constructor() {
    this.api.get('/test').subscribe({
      next: () => console.log('This should not happen'),
      error: (err) => console.error('Caught error in App component:', err)
    });
  }
}
