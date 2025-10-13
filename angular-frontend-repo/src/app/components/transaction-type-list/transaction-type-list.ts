import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { TransactionType } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-type-list',
  imports: [CommonModule],
  templateUrl: './transaction-type-list.html',
  styleUrl: './transaction-type-list.scss'
})
export class TransactionTypeList implements OnInit {
  transactionTypes: TransactionType[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTransactionTypes();
  }

  loadTransactionTypes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.transactionService.getTransactionTypes().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.transactionTypes = response.content;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load transaction types';
      }
    });
  }

  onUpdate(type: TransactionType): void {
    this.router.navigate(['/transaction-type-update'], { 
      queryParams: { typeCode: type.typeCode }
    });
  }

  onDelete(type: TransactionType): void {
    if (confirm(`Are you sure you want to delete transaction type ${type.typeCode}?`)) {
      this.transactionService.deleteTransactionType(type.typeCode).subscribe({
        next: () => {
          this.loadTransactionTypes();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete transaction type';
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin-menu']);
  }
}
