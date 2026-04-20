import { debounce, maxLength, minLength, pattern, required, schema, validate, validateHttp } from "@angular/forms/signals";
import { EmailAvailabilityResponse, PasswordData } from "./auth.model";

export const displayNameSchema = schema<string>((displayNamePath) => {
  required(displayNamePath, { message: 'Display name required' });
  minLength(displayNamePath, 2, { message: 'Display name must be at least 2 characters' });
  maxLength(displayNamePath, 50, { message: 'Display name must be less than 50 characters' });
});

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const emailSchema = (API_BASE_URL: string) => (isRegisterMode: () => boolean) => schema<string>((emailPath) => {
  required(emailPath, { message: 'Email required' });
  pattern(emailPath, emailPattern, { message: 'Invalid email format' });
  debounce(emailPath, 1000);

  // TODO
  validateHttp<string, EmailAvailabilityResponse>(emailPath, {
    request: ({value}) => {
      const email = value();

      if (email && isRegisterMode()) {
        return email ? `${API_BASE_URL}/api/users/email?email=${email}` : undefined;
      }

      return undefined;
    },
    onSuccess: (response) => {
      return !response
      ? null
      : {
        kind: 'emailTaken',
        message: 'Email is already taken'
      };
    },
    onError: (error) => {
      console.error('Error validating email', error);
      return {
        kind: 'serverError',
        message: 'Could not verify email at this time. Please try again later'
      };
    }
  });
});

export const loginPasswordSchema = schema<string>((passwordPath) => {
  required(passwordPath, { message: 'Password required' });
});

export const passwordSchema = schema<PasswordData>((passwordPath) => {
  required(passwordPath.password, { message: 'Password required' });
  required(passwordPath.confirmPassword, { message: 'Confirm password required' });
  minLength(passwordPath.password, 8, { message: 'Password must be at least 8 characters' });

  validate(passwordPath.confirmPassword, ({value, valueOf}) => {

    const confirmPassword = value();
    const password = valueOf(passwordPath.password);

    if (confirmPassword !== password) {
      return {
        kind: 'error',
        message: 'Passwords do not match'
      };
    }

    return null;
  });
});
