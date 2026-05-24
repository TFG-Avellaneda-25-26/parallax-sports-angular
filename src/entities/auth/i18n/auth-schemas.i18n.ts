export const authSchemasI18n = {
  displayName: {
    required: $localize`:@@schema.display-name.required:Display name required`,
    minLength: $localize`:@@schema.display-name.min-length:Display name must be at least 2 characters`,
    maxLength: $localize`:@@schema.display-name.max-length:Display name must be less than 50 characters`,
  },
  email: {
    required: $localize`:@@schema.email.required:Email required`,
    pattern: $localize`:@@schema.email.pattern:Invalid email format`,
    taken: $localize`:@@schema.email.taken:Email is already taken`,
    notFound: $localize`:@@schema.email.not-found:No account found with this email`,
    serverError: $localize`:@@schema.email.server-error:Could not verify email at this time. Please try again later`,
  },
  password: {
    required: $localize`:@@schema.password.required:Password required`,
    confirmRequired: $localize`:@@schema.password.confirm-required:Confirm password required`,
    minLength: $localize`:@@schema.password.min-length:Password must be at least 8 characters`,
    noMatch: $localize`:@@schema.password.no-match:Passwords do not match`,
  },
};
