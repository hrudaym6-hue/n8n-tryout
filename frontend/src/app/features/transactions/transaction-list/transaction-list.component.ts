import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../../core/services/transaction.service';
import { Transaction } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  loading = true;
  error?: string;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    this.transactionService.getTransactions().subscribe({
      next: (transactions) => { this.transactions = transactions; this.loading = false; },
      error: (err) => { this.loading = false; this.error = 'Failed to load transactions'; }
    });
  }
}
