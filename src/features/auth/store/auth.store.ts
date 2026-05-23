import { API_BASE_URL } from '@shared/config';
import { computed, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { displayNameSchema, emailSchema, loginPasswordSchema, passwordSchema, AuthService, AuthData, emailAsyncSchema } from "@entities/auth"
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { UserStore } from "@entities/user";
import { apply, applyWhen, form } from "@angular/forms/signals";
import { lastValueFrom } from "rxjs";

type AuthFormMode = 'login' | 'register';

const formModel = signal<AuthData>({
  displayName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

export const AuthStore = signalStore(
  withState({ mode: 'register' as AuthFormMode }),

  withComputed(({ mode }) => ({
    isRegisterMode: computed(() => mode() === 'register'),
    formSubmissionText: computed(() => mode() === 'login' ? 'Login to account' : 'Create account'),
    formButtonText: computed(() => mode() === 'login' ? 'Switch to Register' : 'Switch to Login'),
    authErrorSubmitMessage: computed(() => mode() === 'login'
      ? 'User or password is incorrect'
      : 'Registration failed. Please check your details and try again.'
    )
  })),

  withMethods((store, authService = inject(AuthService), router = inject(Router), apiBaseUrl = inject(API_BASE_URL), userStore = inject(UserStore)) => {
    const authForm = form(formModel, (schemaPath) => {
      apply(schemaPath.email, emailSchema);
      applyWhen(schemaPath.email, () => store.isRegisterMode(), emailAsyncSchema(apiBaseUrl, 'register'));
      applyWhen(schemaPath.password, () => !store.isRegisterMode(), loginPasswordSchema);
      applyWhen(schemaPath, () => store.isRegisterMode(), passwordSchema);
      applyWhen(schemaPath.displayName, () => store.isRegisterMode(), displayNameSchema);
    }, {
      submission: {
        action: async (field) => {
          const data = field().value();
          const request = !store.isRegisterMode()
            ? authService.login({ email: data.email, password: data.password })
            : authService.register(data);
          try {
            await lastValueFrom(request);
            // Cargar el usuario ANTES de navegar para que el header (OnPush)
            // ya tenga isAuthenticated() = true en el primer render.
            await userStore.loadUser();
            router.navigate(['/dashboard']);
            return null;
          } catch {
            return { kind: 'authError', message: store.authErrorSubmitMessage() };
          }
        },
        ignoreValidators: 'none'
      }
    });

    return {
      authForm,
      toggleMode(): void {
        patchState(store, { mode: !store.isRegisterMode() ? 'register' : 'login' });
      }
    };
  })
);
