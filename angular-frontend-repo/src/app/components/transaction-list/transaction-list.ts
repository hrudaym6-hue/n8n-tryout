import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';
import { CustomValidators } from '../../shared/validators';

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss'
})
export class TransactionList implements OnInit {
  searchForm!: FormGroup;
  transactions: Transaction[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      accountId: ['', [Validators.required, CustomValidators.numeric(), CustomValidators.exactLength(11)]],
      cardNumber: ['', [CustomValidators.numeric(), CustomValidators.exactLength(16)]]
    });
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      this.markFormGroupTouched(this.searchForm);
      if (!this.searchForm.get('accountId')?.value) {
        this.errorMessage = 'Account ID is required';
      } else if (this.searchForm.get('accountId')?.hasError('exactLength')) {
        this.errorMessage = 'Account ID must be 11 digits long';
      }
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.transactions = [];

    const accountId = this.searchForm.value.accountId;
    const cardNumber = this.searchForm.value.cardNumber;

    const observable = cardNumber 
      ? this.transactionService.getTransactionsByCard(cardNumber)
      : this.transactionService.getTransactionsByAccount(accountId);

    observable.subscribe({
      next: (transactions) => {
        this.isLoading = false;
        this.transactions = transactions;
        if (transactions.length === 0) {
          this.errorMessage = 'No transactions found';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to retrieve transactions';
      }
    });
  }

  onViewDetail(transaction: Transaction): void {
    this.router.navigate(['/transaction-detail'], { 
      queryParams: { transactionId: transaction.transactionId }
    });
  }

  onAddTransaction(): void {
    this.router.navigate(['/transaction-add']);
  }

  onClear(): void {
    this.searchForm.reset();
    this.transactions = [];
    this.errorMessage = '';
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
