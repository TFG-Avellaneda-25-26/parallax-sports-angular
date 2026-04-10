import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { form, FormField, email, required } from '@angular/forms/signals';
import { AuthService } from '../../api/auth.service';
import { AuthStore } from '../../model/auth.store';
import { AuthCredentials, AuthResponse, AuthUser } from '../../model/auth.types';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormField],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  private store = inject(AuthStore);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'El correo es requerido' });
    email(schemaPath.email, { message: 'Ingresa un correo válido' });
    required(schemaPath.password, { message: 'La contraseña es requerida' });
  });

  onSubmit(): void {
    if (!this.loginForm.email().valid() || !this.loginForm.password().valid()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const credentials: AuthCredentials = this.loginModel();

    this.authService.login(credentials).subscribe({
      next: (response: AuthResponse) => {
        this.isLoading.set(false);
        const authUser: AuthUser = {
          id: response.userId,
          email: credentials.email,
          displayName: response.displayName,
        };
        this.store.setAuthenticatedUser(response, authUser);
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        const errorMsg = err.error?.message || 'Error al iniciar sesión';
        this.errorMessage.set(errorMsg);
        this.store.setError(errorMsg);
      },
    });
  }
}
