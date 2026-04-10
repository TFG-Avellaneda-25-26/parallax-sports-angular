import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { form, FormField, email, required, minLength } from '@angular/forms/signals';
import { AuthService } from '../../api/auth.service';
import { AuthStore } from '../../model/auth.store';
import { RegisterCredentials, AuthResponse, AuthUser } from '../../model/auth.types';

interface RegisterData {
  displayName: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, FormField],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  private store = inject(AuthStore);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  registerModel = signal<RegisterData>({
    displayName: '',
    email: '',
    password: '',
  });

  registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.displayName, { message: 'El nombre es requerido' });
    minLength(schemaPath.displayName, 2, { message: 'Mínimo 2 caracteres' });
    required(schemaPath.email, { message: 'El correo es requerido' });
    email(schemaPath.email, { message: 'Ingresa un correo válido' });
    required(schemaPath.password, { message: 'La contraseña es requerida' });
    minLength(schemaPath.password, 8, { message: 'Mínimo 8 caracteres' });
  });

  onSubmit(): void {
    if (!this.registerForm.displayName().valid() || 
        !this.registerForm.email().valid() || 
        !this.registerForm.password().valid()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const credentials: RegisterCredentials = this.registerModel();

    this.authService.register(credentials).subscribe({
      next: (response: AuthResponse) => {
        this.isLoading.set(false);
        const authUser: AuthUser = {
          id: response.userId,
          email: credentials.email,
          displayName: credentials.displayName,
        };
        this.store.setAuthenticatedUser(response, authUser);
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        const errorMsg = err.error?.message || 'Error al registrarse';
        this.errorMessage.set(errorMsg);
        this.store.setError(errorMsg);
      },
    });
  }
}
