import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../api/auth.service';
import { AuthStore } from '../model/auth.store';
import { AuthCredentials, AuthResponse, AuthUser } from '../model/auth.types';
import { FormFieldComponent } from './form-field.component';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="form">
      <app-form-field 
        label="Correo electrónico"
        placeholder="tu@correo.com"
        type="email"
        [control]="emailControl"
        [errorMessages]="emailErrorMessages"
        (blur)="markFieldAsTouched('email')"
      ></app-form-field>

      <app-form-field 
        label="Contraseña"
        placeholder="••••••••"
        type="password"
        [control]="passwordControl"
        (blur)="markFieldAsTouched('password')"
      ></app-form-field>

      <!-- Placeholder para futuros logins con Google y Discord -->
      <div class="social-login-placeholder">
        <p class="placeholder-text">Login con Google o Discord (próximamente)</p>
        <div class="social-buttons-placeholder">
          <button type="button" class="social-button" disabled>
            <span>Google</span>
          </button>
          <button type="button" class="social-button" disabled>
            <span>Discord</span>
          </button>
        </div>
      </div>

      <button 
        type="submit" 
        class="submit-button"
        [disabled]="!loginForm.valid || authService.getAuthLoading()()"
      >
        @if (authService.getAuthLoading()()) {
          <span>Iniciando sesión...</span>
        } @else {
          <span>Iniciar sesión</span>
        }
      </button>
    </form>
  `,
  styleUrl: './form.component.css',
})
export class LoginFormComponent {
  protected store = inject(AuthStore);
  protected authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm: FormGroup;

  emailErrorMessages = {
    required: 'El correo es requerido',
    email: 'Por favor ingresa un correo válido',
  };

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    // Effect para reaccionar a cambios en la respuesta de login
    effect(() => {
      const response = this.authService.getAuthResponse()();
      if (response) {
        const credentials = this.loginForm.value;
        const authUser: AuthUser = {
          id: response.userId,
          email: credentials.email,
          displayName: credentials.email,
        };
        this.store.setAuthenticatedUser(response, authUser);
        this.router.navigate(['/dashboard']);
      }
    });

    // Effect para reaccionar a errores
    effect(() => {
      const error = this.authService.getAuthError()();
      if (error) {
        const errorMessage = error.error?.message || 'Error al iniciar sesión';
        this.store.setError(errorMessage);
      }
    });
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  markFieldAsTouched(fieldName: string): void {
    const field = this.loginForm.get(fieldName);
    if (field) {
      field.markAsTouched();
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const credentials: AuthCredentials = this.loginForm.value;
    this.authService.login(credentials);
  }
}
