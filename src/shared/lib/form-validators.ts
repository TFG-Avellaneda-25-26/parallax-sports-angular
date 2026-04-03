import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordStrength(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasMinLength = value.length >= 8;

  if (hasUpperCase && hasLowerCase && hasNumber && hasMinLength) {
    return null;
  }

  return { passwordStrength: true };
}

export function matchField(fieldName: string) {
  return (control: AbstractControl): ValidationErrors | null => {
    const matchingControl = control.parent?.get(fieldName);
    if (!matchingControl) return null;

    return control.value === matchingControl.value ? null : { matchField: true };
  };
}
