import { computed } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";

type AuthMode = 'auth' | 'recover'
type RecoverStep = 'email' | 'otp' | 'password';

interface AuthModeState {
  mode: AuthMode;
  recoverStep: RecoverStep;
  recoverEmail: string;
}

export const AuthModeStore = signalStore(
  withState<AuthModeState>({
    mode: 'auth',
    recoverStep: 'email',
    recoverEmail: '',
  }),

  withComputed(({ mode, recoverStep }) => ({
    isAuthMode: computed(() => mode() === 'auth'),
    isRecoverMode: computed(() => mode() === 'recover'),
    isEmailStep: computed(() => mode() === 'recover' && recoverStep() === 'email'),
    isOtpStep: computed(() => mode() === 'recover' && recoverStep() === 'otp'),
    isPasswordStep: computed(() => mode() === 'recover' && recoverStep() === 'password'),
    activeView: computed((): 'auth' | 'email' | 'otp' | 'password' =>
      mode() === 'auth' ? 'auth' : recoverStep()
    ),
  })),

  withMethods((store) => ({
    goToAuth(): void {
      patchState(store, { mode: 'auth', recoverStep: 'email', recoverEmail: '' });
    },
    goToRecover(): void {
      patchState(store, { mode: 'recover', recoverStep: 'email', recoverEmail: '' });
    },
    goToOtpStep(email: string): void {
      patchState(store, { mode: 'recover', recoverStep: 'otp', recoverEmail: email });
    },
    goToPasswordStep(): void {
      patchState(store, { mode: 'recover', recoverStep: 'password' });
    },
    setRecoverEmail(email: string): void {
      patchState(store, { recoverEmail: email });
    },
  })),
);
