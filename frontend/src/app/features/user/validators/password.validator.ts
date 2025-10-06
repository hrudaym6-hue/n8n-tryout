import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value);
  return isValid ? null : { passwordStrength: 'Password must be at least 8 characters with uppercase, lowercase, number, and symbol.' };
}
