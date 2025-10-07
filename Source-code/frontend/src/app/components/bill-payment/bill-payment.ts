import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BillPayService, BillPaymentRequest, BillPaymentResponse } from '../../services/bill-pay.service';

@Component({
  selector: 'app-bill-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bill-payment.html',
  styleUrl: './bill-payment.scss'
})
export class BillPayment implements OnInit {
  private fb = inject(FormBuilder);
  private billPayService = inject(BillPayService);
  private router = inject(Router);

  billPayForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;
  paymentResult: BillPaymentResponse | null = null;

  ngOnInit(): void {
    this.billPayForm = this.fb.group({
      accountId: ['', [Validators.required, Validators.maxLength(11)]]
    });
  }

  onSubmit(): void {
    if (this.billPayForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const request: BillPaymentRequest = {
        accountId: this.billPayForm.get('accountId')?.value
      };

      this.billPayService.processBillPayment(request).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.paymentResult = response;
          this.successMessage = `Payment successful! Transaction ID: ${response.transactionId}`;
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Payment processing failed. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Please enter a valid Account ID';
    }
  }

  onClear(): void {
    this.billPayForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
    this.paymentResult = null;
  }

  onBack(): void {
    this.router.navigate(['/main-menu']);
  }
}
