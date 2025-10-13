import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../core/services/transaction.service';
import { AuthService } from '../../../core/services/auth.service';
import { Transaction } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  isLoading = false;
  errorMessage = '';
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;

  constructor(
    private transactionService: TransactionService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.transactionService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.totalPages = Math.ceil(transactions.length / this.pageSize);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load transactions';
        this.isLoading = false;
      }
    });
  }

  get paginatedTransactions(): Transaction[] {
    const start = this.currentPage * this.pageSize;
    return this.transactions.slice(start, start + this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  viewTransaction(transactionId: string): void {
    this.router.navigate(['/transactions', transactionId]);
  }

  addTransaction(): void {
    this.router.navigate(['/transactions/add']);
  }

  goBack(): void {
    if (this.authService.isAdmin) {
      this.router.navigate(['/admin-menu']);
    } else {
      this.router.navigate(['/menu']);
    }
  }
}
