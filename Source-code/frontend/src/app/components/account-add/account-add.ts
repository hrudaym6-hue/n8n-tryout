import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account.service';
import { Account, Customer } from '../../models/account.model';

@Component({
  selector: 'app-account-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-add.html',
  styleUrl: './account-add.scss'
})
export class AccountAdd implements OnInit {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);

  accountForm!: FormGroup;
  customerForm!: FormGroup;
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  ngOnInit(): void {
    this.accountForm = this.fb.group({
      accountId: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      accountStatus: ['A', Validators.required],
      currBalance: [0, [Validators.required, Validators.min(0)]],
      creditLimit: ['', [Validators.required, Validators.min(0)]],
      cashCreditLimit: ['', [Validators.required, Validators.min(0)]],
      openDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
      reissueDate: ['', Validators.required],
      currCycleCredit: [0, [Validators.required, Validators.min(0)]],
      currCycleDebit: [0, [Validators.required, Validators.min(0)]],
      groupId: ['', [Validators.required, Validators.maxLength(10)]]
    });

    this.customerForm = this.fb.group({
      customerId: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      firstName: ['', [Validators.required, Validators.maxLength(25)]],
      middleName: ['', Validators.maxLength(25)],
      lastName: ['', [Validators.required, Validators.maxLength(25)]],
      address: ['', [Validators.required, Validators.maxLength(50)]],
      city: ['', [Validators.required, Validators.maxLength(25)]],
      state: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}$/)]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      governmentId: ['', [Validators.required, Validators.maxLength(9)]],
      creditScore: ['', [Validators.required, Validators.min(300), Validators.max(850)]]
    });
  }

  onSubmit(): void {
    if (this.accountForm.valid && this.customerForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const account: Account = this.accountForm.value;
      const customer: Customer = this.customerForm.value;

      this.accountService.createAccount(account, customer).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.successMessage = `Account ${response.account.accountId} created successfully!`;
          setTimeout(() => {
            this.router.navigate(['/account-list']);
          }, 2000);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Failed to create account. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.markFormGroupTouched(this.accountForm);
      this.markFormGroupTouched(this.customerForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  onClear(): void {
    this.accountForm.reset({
      accountStatus: 'A',
      currBalance: 0,
      currCycleCredit: 0,
      currCycleDebit: 0
    });
    this.customerForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  onBack(): void {
    this.router.navigate(['/account-list']);
  }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    if (field?.hasError('pattern')) {
      return 'Invalid format';
    }
    if (field?.hasError('min')) {
      return `Minimum value is ${field.errors?.['min'].min}`;
    }
    if (field?.hasError('max')) {
      return `Maximum value is ${field.errors?.['max'].max}`;
    }
    if (field?.hasError('maxlength')) {
      return `Maximum length is ${field.errors?.['maxlength'].requiredLength}`;
    }
    return '';
  }
}
