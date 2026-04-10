import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../model/auth.store';
import { LoginFormComponent } from '../login/login-form.component';
import { RegisterFormComponent } from '../register/register-form.component';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, LoginFormComponent, RegisterFormComponent],
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginRegisterComponent {
  private store = inject(AuthStore);

  currentMode = this.store.currentFormMode;

  switchMode(mode: 'login' | 'register'): void {
    this.store.switchFormMode(mode);
  }
}
