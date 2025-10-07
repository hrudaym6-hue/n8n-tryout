import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-add.html',
  styleUrl: './transaction-add.scss'
})
export class TransactionAdd implements OnInit {
  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);
  private router = inject(Router);

  transactionForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;

  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      accountId: ['', [Validators.required, Validators.maxLength(11)]],
      cardNumber: ['', [Validators.required, Validators.maxLength(16)]],
      transactionTypeCode: ['', [Validators.required, Validators.maxLength(2)]],
      transactionCategoryCode: ['', [Validators.required, Validators.maxLength(2)]],
      transactionSource: ['', [Validators.required, Validators.maxLength(10)]],
      transactionDescription: ['', [Validators.required, Validators.maxLength(100)]],
      transactionAmount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      merchantId: ['', Validators.maxLength(9)],
      merchantName: ['', Validators.maxLength(50)],
      merchantCity: ['', Validators.maxLength(50)],
      merchantZipCode: ['', Validators.maxLength(10)]
    });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const transaction: Partial<Transaction> = {
        ...this.transactionForm.value,
        originalTransactionDate: new Date().toISOString(),
        processingDate: new Date().toISOString()
      };

      this.transactionService.createTransaction(transaction).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.successMessage = 'Transaction added successfully!';
          setTimeout(() => this.router.navigate(['/transaction-list']), 2000);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Error adding transaction. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly';
    }
  }

  onCancel(): void {
    this.router.navigate(['/transaction-list']);
  }
}
