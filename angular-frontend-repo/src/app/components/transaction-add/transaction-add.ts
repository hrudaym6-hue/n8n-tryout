import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { CustomValidators } from '../../shared/validators';

@Component({
  selector: 'app-transaction-add',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-add.html',
  styleUrl: './transaction-add.scss'
})
export class TransactionAdd implements OnInit {
  transactionForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      cardNumber: ['', [Validators.required, CustomValidators.numeric(), CustomValidators.exactLength(16)]],
      transactionTypeCode: ['', [Validators.required]],
      transactionCategoryCode: ['', [Validators.required]],
      transactionSource: ['', [Validators.required]],
      transactionDescription: ['', [Validators.required, CustomValidators.alphanumeric()]],
      transactionAmount: ['', [Validators.required, CustomValidators.numeric()]],
      merchantId: ['', [CustomValidators.numeric()]],
      merchantName: ['', [CustomValidators.alphanumeric()]],
      merchantCity: ['', [CustomValidators.alphanumeric()]],
      merchantZip: ['', [CustomValidators.numeric()]]
    });
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) {
      this.markFormGroupTouched(this.transactionForm);
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.transactionService.addTransaction(this.transactionForm.value).subscribe({
      next: (transaction) => {
        this.isSubmitting = false;
        this.successMessage = 'Transaction added successfully';
        setTimeout(() => {
          this.router.navigate(['/transaction-list']);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to add transaction';
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/transaction-list']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
