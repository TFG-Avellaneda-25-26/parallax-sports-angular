import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { form, FormField, email, required, minLength } from '@angular/forms/signals';
import { AuthService, AuthStore, AuthCredentials, RegisterCredentials } from '@features/auth';

interface AuthFormData {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [CommonModule, FormsModule, FormField],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormComponent {
  private store = inject(AuthStore);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  passwordMismatchError = signal<string | null>(null);
  currentMode = this.store.currentFormMode;

  formData = signal<AuthFormData>({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  authForm = form(this.formData, (schemaPath) => {
    // Validaciones comunes
    required(schemaPath.email, { message: 'El correo es requerido' });
    email(schemaPath.email, { message: 'Ingresa un correo válido' });
    required(schemaPath.password, { message: 'La contraseña es requerida' });

    // Validaciones condicionales para registro
    if (this.currentMode() === 'register') {
      required(schemaPath.displayName, { message: 'El nombre es requerido' });
      minLength(schemaPath.displayName, 2, { message: 'Mínimo 2 caracteres' });
      minLength(schemaPath.password, 8, { message: 'Mínimo 8 caracteres' });
    }
  });

  switchMode(mode: 'login' | 'register'): void {
    this.store.switchFormMode(mode);
    this.errorMessage.set(null);
  }

  onSubmit(): void {
    if (this.currentMode() === 'login') {
      this.submitLogin();
    } else {
      this.submitRegister();
    }
  }

  private submitLogin(): void {
    if (!this.authForm.email().valid() || !this.authForm.password().valid()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const credentials: AuthCredentials = {
      email: this.formData().email,
      password: this.formData().password,
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.store.setAuthenticated();
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        const errorMsg = err.error?.message || 'Error al iniciar sesión';
        this.errorMessage.set(errorMsg);
      },
    });
  }

  onConfirmPasswordBlur(): void {
    const password = this.formData().password;
    const confirmPassword = this.formData().confirmPassword;

    if (confirmPassword && password !== confirmPassword) {
      this.passwordMismatchError.set('Las contraseñas no coinciden');
    } else {
      this.passwordMismatchError.set(null);
    }
  }

  loginWithOAuth(provider: 'google' | 'discord'): void {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  }

  private submitRegister(): void {
    if (!this.authForm.displayName().valid() ||
        !this.authForm.email().valid() ||
        !this.authForm.password().valid()) {
      return;
    }

    if (this.formData().password !== this.formData().confirmPassword) {
      this.passwordMismatchError.set('Las contraseñas no coinciden');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const credentials: RegisterCredentials = {
      displayName: this.formData().displayName,
      email: this.formData().email,
      password: this.formData().password,
    };

    this.authService.register(credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.store.setAuthenticated();
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        const errorMsg = err.error?.message || 'Error al registrarse';
        this.errorMessage.set(errorMsg);
      },
    });
  }
}
