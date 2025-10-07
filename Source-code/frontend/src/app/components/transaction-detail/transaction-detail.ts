import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-detail.html',
  styleUrl: './transaction-detail.scss'
})
export class TransactionDetail implements OnInit {
  private transactionService = inject(TransactionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  transactionDetail: Transaction | null = null;
  errorMessage = '';
  isLoading = true;

  ngOnInit(): void {
    const transactionId = this.route.snapshot.paramMap.get('id');
    if (transactionId) {
      this.loadTransaction(transactionId);
    }
  }

  loadTransaction(transactionId: string): void {
    this.transactionService.getTransaction(transactionId).subscribe({
      next: (data) => {
        this.transactionDetail = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error loading transaction details.';
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/transaction-list']);
  }
}
