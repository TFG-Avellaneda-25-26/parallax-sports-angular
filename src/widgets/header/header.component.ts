import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@entities/auth';
import { UserStore } from '@entities/user';
import { ThemeToggleComponent } from "@features/theme-switch";

@Component({
  selector: 'app-header',
  imports: [ThemeToggleComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly userStore = inject(UserStore);
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  logout() {
  this.authService.logout().subscribe({
    next: () => {
      this.userStore.clearUser();
      this.router.navigate(['/']);
    },
    error: () => {
      this.router.navigate(['/']);  // navigate anyway even if logout fails
    }
  });
}
}
