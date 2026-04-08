import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../api/auth.service';
import { AuthStore } from '../model/auth.store';
import { passwordStrength } from '@shared/lib/form-validators';
import { RegisterCredentials, AuthResponse, CheckEmailResponse, AuthUser } from '../model/auth.types';
import { FormFieldComponent } from './form-field.component';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="form">
      <app-form-field 
        label="Nombre"
        placeholder="Juan García"
        type="text"
        [control]="displayNameControl"
        [errorMessages]="displayNameErrorMessages"
        (blur)="markFieldAsTouched('displayName')"
      ></app-form-field>

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
        [errorMessages]="passwordErrorMessages"
        (blur)="markFieldAsTouched('password')"
      ></app-form-field>

      <button 
        type="submit" 
        class="submit-button"
        [disabled]="!registerForm.valid || authService.getRegisterLoading()()"
      >
        @if (authService.getRegisterLoading()()) {
          <span>Registrando...</span>
        } @else {
          <span>Registrarse</span>
        }
      </button>
    </form>
  `,
  styleUrl: './form.component.css',
})
export class RegisterFormComponent {
  protected store = inject(AuthStore);
  protected authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  emailExists = signal(false);
  checkingEmail = signal(false);

  registerForm: FormGroup;

  displayNameErrorMessages = {
    required: 'El nombre es requerido',
    minlength: 'Mínimo 2 caracteres',
  };

  emailErrorMessages = {
    required: 'El correo es requerido',
    email: 'Por favor ingresa un correo válido',
    emailExists: 'Este correo ya está registrado',
  };

  passwordErrorMessages = {
    required: 'La contraseña es requerida',
    minlength: 'Mínimo 8 caracteres',
    passwordStrength: 'Debe contener mayúscula, minúscula, número y 8+ caracteres',
  };

  constructor() {
    this.registerForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), passwordStrength]],
    });

    this.setupEmailExistenceCheck();

    // Effect for successful registration
    effect(() => {
      const response = this.authService.getRegisterResponse()();
      if (response) {
        const authUser: AuthUser = {
          id: response.userId,
          email: this.registerForm.get('email')?.value,
          displayName: this.registerForm.get('displayName')?.value,
        };
        this.store.setAuthenticatedUser(response, authUser);
        this.router.navigate(['/dashboard']);
      }
    });

    // Effect for registration errors
    effect(() => {
      const error = this.authService.getRegisterError()();
      if (error) {
        const errorMessage = error.error?.message || 'Error al registrarse';
        this.store.setError(errorMessage);
      }
    });
  }

  private setupEmailExistenceCheck(): void {
    const emailControl = this.registerForm.get('email');
    if (emailControl) {
      let debounceTimer: any;

      // Watch for email control changes
      effect(() => {
        // Re-run whenever registerForm value changes
        this.registerForm.valueChanges;

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          if (emailControl.valid && emailControl.dirty) {
            this.checkingEmail.set(true);
            this.authService.checkEmailExists(emailControl.value);
          }
        }, 300);
      });

      // Watch for email check response
      effect(() => {
        const response = this.authService.getCheckEmailResponse()();
        this.checkingEmail.set(false);
        if (response) {
          this.emailExists.set(response.exists);
          if (response.exists) {
            emailControl.setErrors({ emailExists: true });
          } else {
            const errors = emailControl.errors;
            if (errors) {
              delete errors['emailExists'];
              if (Object.keys(errors).length === 0) {
                emailControl.setErrors(null);
              } else {
                emailControl.setErrors(errors);
              }
            }
          }
        }
      });

      // Watch for email check errors
      effect(() => {
        const error = this.authService.getCheckEmailError()();
        if (error) {
          this.checkingEmail.set(false);
        }
      });
    }
  }

  get displayNameControl() {
    return this.registerForm.get('displayName');
  }

  get emailControl() {
    return this.registerForm.get('email');
  }

  get passwordControl() {
    return this.registerForm.get('password');
  }

  markFieldAsTouched(fieldName: string): void {
    const field = this.registerForm.get(fieldName);
    if (field) {
      field.markAsTouched();
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.emailExists()) return;
    const credentials: RegisterCredentials = this.registerForm.value;
    this.authService.register(credentials);
  }
}
