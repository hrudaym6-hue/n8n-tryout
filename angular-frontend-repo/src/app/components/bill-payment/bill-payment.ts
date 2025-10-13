import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BillPaymentService } from '../../services/bill-payment.service';
import { CustomValidators } from '../../shared/validators';

@Component({
  selector: 'app-bill-payment',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bill-payment.html',
  styleUrl: './bill-payment.scss'
})
export class BillPayment implements OnInit {
  paymentForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private billPaymentService: BillPaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      accountId: ['', [Validators.required, CustomValidators.numeric(), CustomValidators.exactLength(11)]],
      paymentAmount: ['', [Validators.required, CustomValidators.numeric()]],
      paymentDate: ['', [Validators.required, CustomValidators.dateFormat()]],
      confirmationNumber: ['', [CustomValidators.alphanumeric()]]
    });
  }

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.markFormGroupTouched(this.paymentForm);
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.billPaymentService.createPayment(this.paymentForm.value).subscribe({
      next: (payment) => {
        this.isSubmitting = false;
        this.successMessage = `Payment processed successfully. Confirmation Number: ${payment.confirmationNumber}`;
        this.paymentForm.reset();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to process payment';
      }
    });
  }

  onClear(): void {
    this.paymentForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/main-menu']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
