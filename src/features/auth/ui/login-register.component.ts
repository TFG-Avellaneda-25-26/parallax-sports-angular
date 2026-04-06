import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../model/auth.store';
import { FormMode } from '../model/auth.types';
import { LoginFormComponent } from './login-form.component';
import { RegisterFormComponent } from './register-form.component';
import { AuthFormTabsComponent } from './auth-form-tabs.component';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [
    CommonModule,
    LoginFormComponent,
    RegisterFormComponent,
    AuthFormTabsComponent,
  ],
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.css',
})
export class LoginRegisterComponent {
  protected store = inject(AuthStore);

  switchMode(mode: FormMode): void {
    this.store.switchFormMode(mode);
  }
}
