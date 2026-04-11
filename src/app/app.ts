import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeStore } from '@features/theme-switch/model/theme.store';
import { ThemeToggleComponent } from '@features/theme-switch/ui/theme-toggle';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeToggleComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly themeStore = inject(ThemeStore);
}
