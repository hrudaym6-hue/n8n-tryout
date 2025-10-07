import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { TransactionListItem } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss'
})
export class TransactionList implements OnInit {
  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);
  private router = inject(Router);

  searchForm!: FormGroup;
  transactions: TransactionListItem[] = [];
  errorMessage = '';
  isLoading = false;
  currentPage = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.maxLength(16)]]
    });
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      this.loadTransactions();
    } else {
      this.errorMessage = 'Please enter a valid Card Number';
    }
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const cardNumber = this.searchForm.get('cardNumber')?.value;

    this.transactionService.getTransactionsByCard(cardNumber, this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.transactions = data;
        this.isLoading = false;
        if (data.length === 0) {
          this.errorMessage = 'No transactions found for this card.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error retrieving transactions. Please try again.';
        this.transactions = [];
      }
    });
  }

  viewTransaction(transactionId: string): void {
    this.router.navigate(['/transaction-detail', transactionId]);
  }

  addTransaction(): void {
    this.router.navigate(['/transaction-add']);
  }

  onBack(): void {
    this.router.navigate(['/main-menu']);
  }

  nextPage(): void {
    this.currentPage++;
    this.loadTransactions();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadTransactions();
    }
  }
}
