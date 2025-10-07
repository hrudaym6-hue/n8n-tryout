import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TransactionTypeService } from '../../services/transaction-type.service';
import { TransactionType } from '../../models/transaction-type.model';

@Component({
  selector: 'app-transaction-type-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-type-update.html',
  styleUrl: './transaction-type-update.scss'
})
export class TransactionTypeUpdate implements OnInit {
  private fb = inject(FormBuilder);
  private transactionTypeService = inject(TransactionTypeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  transactionTypeForm!: FormGroup;
  transactionTypeDetail: TransactionType | null = null;
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;
  isLoading = true;

  ngOnInit(): void {
    const typeCode = this.route.snapshot.paramMap.get('typeCode');
    if (typeCode) {
      this.loadTransactionType(typeCode);
    }

    this.transactionTypeForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  loadTransactionType(typeCode: string): void {
    this.transactionTypeService.getTransactionType(typeCode).subscribe({
      next: (data) => {
        this.transactionTypeDetail = data;
        this.transactionTypeForm.patchValue({
          description: data.description
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error loading transaction type details.';
      }
    });
  }

  onSubmit(): void {
    if (this.transactionTypeForm.valid && this.transactionTypeDetail) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const updateData: TransactionType = {
        ...this.transactionTypeDetail,
        description: this.transactionTypeForm.get('description')?.value
      };

      this.transactionTypeService.updateTransactionType(this.transactionTypeDetail.typeCode, updateData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.successMessage = 'Transaction type updated successfully!';
          setTimeout(() => this.router.navigate(['/transaction-type-list']), 2000);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Error updating transaction type. Please try again.';
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/transaction-type-list']);
  }
}
