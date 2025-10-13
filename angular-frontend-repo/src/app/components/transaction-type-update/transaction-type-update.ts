import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { CustomValidators } from '../../shared/validators';

@Component({
  selector: 'app-transaction-type-update',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-type-update.html',
  styleUrl: './transaction-type-update.scss'
})
export class TransactionTypeUpdate implements OnInit {
  updateForm!: FormGroup;
  typeCode: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isUpdating: boolean = false;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      description: ['', [Validators.required, CustomValidators.alphanumeric()]]
    });

    this.route.queryParams.subscribe(params => {
      if (params['typeCode']) {
        this.typeCode = params['typeCode'];
      }
    });
  }

  onUpdate(): void {
    if (this.updateForm.invalid) {
      this.markFormGroupTouched(this.updateForm);
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    if (!this.typeCode) {
      this.errorMessage = 'Type code is required';
      return;
    }

    this.isUpdating = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.transactionService.updateTransactionType(
      this.typeCode, 
      this.updateForm.value.description
    ).subscribe({
      next: (type) => {
        this.isUpdating = false;
        this.successMessage = 'Transaction type updated successfully';
        setTimeout(() => {
          this.router.navigate(['/transaction-type-list']);
        }, 2000);
      },
      error: (error) => {
        this.isUpdating = false;
        this.errorMessage = error.error?.message || 'Failed to update transaction type';
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/transaction-type-list']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
