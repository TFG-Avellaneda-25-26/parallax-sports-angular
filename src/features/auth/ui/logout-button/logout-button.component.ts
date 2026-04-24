import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@entities/auth';
import { UserStore } from '@entities/user';

@Component({
  selector: 'app-logout-button',
  imports: [],
  templateUrl: './logout-button.component.html',
  styleUrl: './logout-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutButtonComponent {
  private readonly userStore = inject(UserStore);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.userStore.clearUser();
        this.router.navigate(['/']);
      },
      error: () => this.router.navigate(['/'])
    });
  }
}
