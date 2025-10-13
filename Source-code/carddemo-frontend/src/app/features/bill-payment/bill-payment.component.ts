import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BillPaymentService } from '../../core/services/bill-payment.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-bill-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bill-payment.component.html',
  styleUrls: ['./bill-payment.component.css']
})
export class BillPaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private billPaymentService: BillPaymentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.paymentForm = this.formBuilder.group({
      accountId: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      paymentAmount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{2})?$/), Validators.min(0.01)]],
      confirmAmount: ['', [Validators.required]]
    }, { validators: this.amountMatchValidator });
  }

  amountMatchValidator(group: FormGroup) {
    const amount = group.get('paymentAmount')?.value;
    const confirm = group.get('confirmAmount')?.value;
    return amount === confirm ? null : { amountMismatch: true };
  }

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.errorMessage = 'Please fix all validation errors';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const paymentData = {
      accountId: this.paymentForm.value.accountId,
      amount: parseFloat(this.paymentForm.value.paymentAmount)
    };
    
    this.billPaymentService.processPayment(paymentData).subscribe({
      next: () => {
        this.successMessage = 'Payment processed successfully';
        this.isLoading = false;
        this.paymentForm.reset();
      },
      error: (error) => {
        if (error.status === 404) {
          this.errorMessage = 'Account not found';
        } else if (error.status === 400) {
          this.errorMessage = 'Invalid payment amount';
        } else {
          this.errorMessage = 'Failed to process payment';
        }
        this.isLoading = false;
      }
    });
  }

  clearForm(): void {
    this.paymentForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  goBack(): void {
    if (this.authService.isAdmin) {
      this.router.navigate(['/admin-menu']);
    } else {
      this.router.navigate(['/menu']);
    }
  }

  get accountId() {
    return this.paymentForm.get('accountId');
  }

  get paymentAmount() {
    return this.paymentForm.get('paymentAmount');
  }

  get confirmAmount() {
    return this.paymentForm.get('confirmAmount');
  }
}
