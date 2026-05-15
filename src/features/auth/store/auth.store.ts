import { API_BASE_URL } from '@shared/config';
import { computed, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { displayNameSchema, emailSchema, loginPasswordSchema, passwordSchema, AuthService, AuthData, emailAsyncSchema, emailExistsAsyncSchema, otpSchema } from "@entities/auth"
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { UserStore } from "@entities/user";
import { apply, applyWhen, form } from "@angular/forms/signals";
import { lastValueFrom } from "rxjs";

type AuthMode = 'login' | 'register' | 'forgot-password';
type ForgotPasswordStep = 'request' | 'verify' | 'reset';

const formModel = signal<AuthData>({
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
  otp: ''
})

export const AuthStore = signalStore(
  withState({ 
    mode: 'register' as AuthMode,
    forgotPasswordStep: 'request' as ForgotPasswordStep
  }),

  withComputed(({ mode, forgotPasswordStep }) => ({
    isRegisterMode: computed(() => mode() === 'register'),
    isLoginMode: computed(() => mode() === 'login'),
    isForgotPasswordMode: computed(() => mode() === 'forgot-password'),
    formSubmissionText: computed(() => {
      if (mode() === 'login') return 'Login to account';
      if (mode() === 'register') return 'Create account';
      if (forgotPasswordStep() === 'request') return 'Send code';
      if (forgotPasswordStep() === 'verify') return 'Verify code';
      return 'Reset password';
    }),
    formButtonText: computed(() => {
      if (mode() === 'forgot-password') return 'Back to Login';
      return mode() === 'login' ? 'Switch to Register' : 'Switch to Login';
    }),
    authErrorSubmitMessage: computed(() => {
      if (mode() === 'login') return 'User or password is incorrect';
      if (mode() === 'register') return 'Registration failed. Please check your details and try again.';
      if (forgotPasswordStep() === 'request') return 'Failed to send verification code.';
      if (forgotPasswordStep() === 'verify') return 'Invalid verification code.';
      return 'Failed to reset password.';
    })
  })),

  withMethods((store, authService = inject(AuthService), router = inject(Router), apiBaseUrl = inject(API_BASE_URL), userStore = inject(UserStore)) => {
    const authForm = form(formModel, (schemaPath) => {
      apply(schemaPath.email, emailSchema);
      applyWhen(schemaPath.email, () => store.isRegisterMode(), emailAsyncSchema(apiBaseUrl));
      applyWhen(schemaPath.email, () => store.isForgotPasswordMode() && store.forgotPasswordStep() === 'request', emailExistsAsyncSchema(apiBaseUrl));
      
      applyWhen(schemaPath.password, () => store.isLoginMode(), loginPasswordSchema);
      applyWhen(schemaPath, () => store.isRegisterMode(), passwordSchema);
      applyWhen(schemaPath.displayName, () => store.isRegisterMode(), displayNameSchema);

      // Forgot password reset
      applyWhen(schemaPath, () => store.isForgotPasswordMode() && store.forgotPasswordStep() === 'reset', passwordSchema);

      // Forgot password verify
      applyWhen(schemaPath.otp, () => store.isForgotPasswordMode() && store.forgotPasswordStep() === 'verify', otpSchema);
    }, {
      submission: {
        action: async (field) => {
          const data = field().value();
          
          if (store.isForgotPasswordMode()) {
            try {
              if (store.forgotPasswordStep() === 'request') {
                await lastValueFrom(authService.requestForgotPassword(data.email));
                patchState(store, { forgotPasswordStep: 'verify' });
                return null;
              }
              if (store.forgotPasswordStep() === 'verify') {
                if (!data.otp) return { kind: 'otpRequired', message: 'Verification code is required' };
                await lastValueFrom(authService.verifyForgotPassword(data.email, data.otp));
                patchState(store, { forgotPasswordStep: 'reset' });
                return null;
              }
              if (store.forgotPasswordStep() === 'reset') {
                await lastValueFrom(authService.resetPassword(data.email, data.otp!, data.password));
                patchState(store, { mode: 'login', forgotPasswordStep: 'request' });
                // Reset form fields but keep email for convenience? 
                // Actually better to reset it fully.
                field().reset();
                return null;
              }
            } catch (e) {
              return { kind: 'authError', message: store.authErrorSubmitMessage() };
            }
            return null;
          }

          const request = store.isLoginMode()
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
        const currentMode = store.mode();
        if (currentMode === 'forgot-password') {
          patchState(store, { mode: 'login', forgotPasswordStep: 'request' });
        } else {
          patchState(store, { mode: currentMode === 'login' ? 'register' : 'login' });
        }
      },
      setForgotPasswordMode(): void {
        patchState(store, { mode: 'forgot-password', forgotPasswordStep: 'request' });
      },
      updateOtp(code: string): void {
        authForm().value.update(val => ({ ...val, otp: code }));
      }
    };
  })
);
