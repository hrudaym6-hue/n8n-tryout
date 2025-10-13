import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static numeric(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const isValid = /^\d+$/.test(control.value);
      return isValid ? null : { numeric: true };
    };
  }

  static alphanumeric(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const isValid = /^[a-zA-Z0-9\s]*$/.test(control.value);
      return isValid ? null : { alphanumeric: true };
    };
  }

  static exactLength(length: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const isValid = control.value.length === length;
      return isValid ? null : { exactLength: { requiredLength: length, actualLength: control.value.length } };
    };
  }

  static dateFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const isValid = /^\d{4}-\d{2}-\d{2}$/.test(control.value);
      return isValid ? null : { dateFormat: true };
    };
  }

  static userType(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const isValid = control.value === 'R' || control.value === 'A';
      return isValid ? null : { userType: true };
    };
  }

  static yesNo(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const isValid = control.value === 'Y' || control.value === 'N';
      return isValid ? null : { yesNo: true };
    };
  }
}
