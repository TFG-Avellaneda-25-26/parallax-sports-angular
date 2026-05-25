import { debounce, maxLength, minLength, pattern, required, schema, validate, validateHttp } from "@angular/forms/signals";
import { EmailAvailabilityResponse, PasswordData } from "./auth.model";
import { authSchemasI18n } from "../i18n/auth-schemas.i18n";

export const displayNameSchema = schema<string>((displayNamePath) => {
  required(displayNamePath, { message:  authSchemasI18n.displayName.required });
  minLength(displayNamePath, 2, { message: authSchemasI18n.displayName.minLength });
  maxLength(displayNamePath, 50, { message: authSchemasI18n.displayName.maxLength });
});

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const emailAsyncSchema = (API_BASE_URL: string, mode: 'register' | 'recover') => schema<string>((emailPath) => {
  debounce(emailPath, 1000);
  validateHttp<string, EmailAvailabilityResponse>(emailPath, {
    request: ({value}) => {
      const email = value();

      if (email) {
        return email ? `${API_BASE_URL}/api/users/email?email=${email}` : undefined;
      }

      return undefined;
    },
    onSuccess: (response) => {
      if (mode === 'register') {
        return !response
        ? null
        : { kind: 'emailTaken', message: authSchemasI18n.email.taken };
      } else {
        return response
        ? null
        : { kind: 'emailNotFound', message: authSchemasI18n.email.notFound };
      }
    },
    onError: (error) => {
      console.error('Error validating email', error);
      return {
        kind: 'serverError',
        message: authSchemasI18n.email.serverError
      };
    }
  });
});

export const emailSchema = schema<string>((emailPath) => {
  required(emailPath, { message: authSchemasI18n.email.required });
  pattern(emailPath, emailPattern, { message: authSchemasI18n.email.pattern });
});

export const loginPasswordSchema = schema<string>((passwordPath) => {
  required(passwordPath, { message: authSchemasI18n.password.required });
});

export const passwordSchema = schema<PasswordData>((passwordPath) => {
  required(passwordPath.password, { message: authSchemasI18n.password.required });
  required(passwordPath.confirmPassword, { message: authSchemasI18n.password.confirmRequired });
  minLength(passwordPath.password, 8, { message: authSchemasI18n.password.minLength });

  validate(passwordPath.confirmPassword, ({value, valueOf}) => {

    const confirmPassword = value();
    const password = valueOf(passwordPath.password);

    if (confirmPassword !== password) {
      return {
        kind: 'error',
        message: authSchemasI18n.password.noMatch
      };
    }

    return null;
  });
});
