import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-detail',
  imports: [CommonModule],
  templateUrl: './transaction-detail.html',
  styleUrl: './transaction-detail.scss'
})
export class TransactionDetail implements OnInit {
  transaction: Transaction | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['transactionId']) {
        this.loadTransaction(params['transactionId']);
      }
    });
  }

  loadTransaction(transactionId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.transactionService.getTransaction(transactionId).subscribe({
      next: (transaction) => {
        this.isLoading = false;
        this.transaction = transaction;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Transaction Not Found';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/transaction-list']);
  }
}
