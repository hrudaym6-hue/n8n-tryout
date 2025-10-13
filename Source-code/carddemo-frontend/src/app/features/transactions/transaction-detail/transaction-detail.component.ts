import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../core/services/transaction.service';
import { Transaction } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.css']
})
export class TransactionDetailComponent implements OnInit {
  transaction: Transaction | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    const transactionId = this.route.snapshot.paramMap.get('id');
    if (transactionId) {
      this.loadTransaction(transactionId);
    }
  }

  loadTransaction(transactionId: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.transactionService.getTransactionById(transactionId).subscribe({
      next: (transaction) => {
        this.transaction = transaction;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.status === 404 ? 'Transaction not found' : 'Failed to load transaction';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/transactions']);
  }
}
