import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TransactionTypeService } from '../../services/transaction-type.service';
import { TransactionType } from '../../models/transaction-type.model';

@Component({
  selector: 'app-transaction-type-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-type-list.html',
  styleUrl: './transaction-type-list.scss'
})
export class TransactionTypeList implements OnInit {
  private fb = inject(FormBuilder);
  private transactionTypeService = inject(TransactionTypeService);
  private router = inject(Router);

  searchForm!: FormGroup;
  transactionTypes: TransactionType[] = [];
  errorMessage = '';
  isLoading = false;
  currentPage = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      typeCode: [''],
      description: ['']
    });
    this.loadTransactionTypes();
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadTransactionTypes();
  }

  loadTransactionTypes(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const typeCode = this.searchForm.get('typeCode')?.value;
    const description = this.searchForm.get('description')?.value;

    this.transactionTypeService.getTransactionTypes(typeCode, description, this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.transactionTypes = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error retrieving transaction types. Please try again.';
        this.transactionTypes = [];
      }
    });
  }

  updateTransactionType(typeCode: string): void {
    this.router.navigate(['/transaction-type-update', typeCode]);
  }

  deleteTransactionType(typeCode: string): void {
    if (confirm(`Are you sure you want to delete transaction type ${typeCode}?`)) {
      this.transactionTypeService.deleteTransactionType(typeCode).subscribe({
        next: () => {
          this.loadTransactionTypes();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Error deleting transaction type. Please try again.';
        }
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/admin-menu']);
  }

  nextPage(): void {
    this.currentPage++;
    this.loadTransactionTypes();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadTransactionTypes();
    }
  }
}
