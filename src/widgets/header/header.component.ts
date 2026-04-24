import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserStore } from '@entities/user';
import { LogoutButtonComponent, VerifyEmailComponent } from '@features/auth';
import { ThemeToggleComponent } from "@features/theme-switch";

@Component({
  selector: 'app-header',
  imports: [ThemeToggleComponent, LogoutButtonComponent, VerifyEmailComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly userStore = inject(UserStore);
}
