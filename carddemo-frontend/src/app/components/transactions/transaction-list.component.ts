import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css'
})
export class TransactionListComponent implements OnInit {
  transactions = signal<Transaction[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  searchAccountId = signal<string>('');
  searchCardNumber = signal<string>('');
  startDate = signal<string>('');
  endDate = signal<string>('');
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalRecords = signal<number>(0);
  pageSize = 10;

  constructor(
    private transactionService: TransactionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['accountId']) {
        this.searchAccountId.set(params['accountId']);
      }
      this.loadTransactions();
    });
  }

  loadTransactions(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const accountId = this.searchAccountId() || undefined;
    const cardNumber = this.searchCardNumber() || undefined;
    const startDate = this.startDate() || undefined;
    const endDate = this.endDate() || undefined;

    this.transactionService.getTransactions(
      this.currentPage(),
      this.pageSize,
      accountId,
      cardNumber,
      startDate,
      endDate
    ).subscribe({
      next: (response) => {
        this.transactions.set(response.transactions);
        this.totalRecords.set(response.total);
        this.totalPages.set(Math.ceil(response.total / this.pageSize));
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load transactions');
        this.isLoading.set(false);
      }
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadTransactions();
  }

  onClearSearch(): void {
    this.searchAccountId.set('');
    this.searchCardNumber.set('');
    this.startDate.set('');
    this.endDate.set('');
    this.currentPage.set(1);
    this.loadTransactions();
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadTransactions();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadTransactions();
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  maskCardNumber(cardNumber: string): string {
    if (cardNumber.length <= 4) return cardNumber;
    return '**** **** **** ' + cardNumber.slice(-4);
  }
}
