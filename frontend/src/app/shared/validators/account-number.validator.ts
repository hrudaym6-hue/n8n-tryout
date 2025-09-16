import { AbstractControl, ValidationErrors } from '@angular/forms';
export function accountNumberValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (typeof value === 'string' && value.length !== 10) {
    return { accountNumberLength: true };
  }
  return null;
}
