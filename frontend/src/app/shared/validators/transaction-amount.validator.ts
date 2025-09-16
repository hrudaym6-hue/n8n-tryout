import { AbstractControl, ValidationErrors } from '@angular/forms';
export function transactionAmountValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value < 0.01) return { minTransactionAmount: true };
  if (value > 100000) return { maxTransactionAmount: true };
  return null;
}
