import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService, Transaction, TransactionListResponse } from '../../../core/services/transaction.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
  standalone: false
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  loading = false;
  errorMessage = '';
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  searchCardNumber = '';
  searchAccountId = '';

  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.transactionService.getTransactions(
      this.currentPage, 
      this.pageSize, 
      this.searchAccountId || undefined,
      this.searchCardNumber || undefined
    ).subscribe({
      next: (response: TransactionListResponse) => {
        this.transactions = response.transactions;
        this.totalRecords = response.total;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load transactions. Please try again.';
        console.error('Error loading transactions:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadTransactions();
  }

  onClearSearch(): void {
    this.searchCardNumber = '';
    this.searchAccountId = '';
    this.currentPage = 1;
    this.loadTransactions();
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTransactions();
    }
  }

  onNextPage(): void {
    const totalPages = Math.ceil(this.totalRecords / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.loadTransactions();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  onBackToMenu(): void {
    this.router.navigate(['/menu']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
