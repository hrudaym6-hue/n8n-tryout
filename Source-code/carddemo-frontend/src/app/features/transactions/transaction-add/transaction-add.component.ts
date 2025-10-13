import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../core/services/transaction.service';

@Component({
  selector: 'app-transaction-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-add.component.html',
  styleUrls: ['./transaction-add.component.css']
})
export class TransactionAddComponent implements OnInit {
  addForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      typeId: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      categoryCode: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      transactionSource: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{2})?$/), Validators.min(0.01)]],
      description: [''],
      merchantInfo: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.addForm.invalid) {
      this.errorMessage = 'Please fix all validation errors';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const transactionData = this.addForm.value;
    
    this.transactionService.addTransaction(transactionData).subscribe({
      next: () => {
        this.successMessage = 'Transaction added successfully';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/transactions']);
        }, 1500);
      },
      error: (error) => {
        if (error.status === 404) {
          this.errorMessage = 'Card not found';
        } else {
          this.errorMessage = 'Failed to add transaction';
        }
        this.isLoading = false;
      }
    });
  }

  clearForm(): void {
    this.addForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/transactions']);
  }

  get cardNumber() {
    return this.addForm.get('cardNumber');
  }

  get typeId() {
    return this.addForm.get('typeId');
  }

  get categoryCode() {
    return this.addForm.get('categoryCode');
  }

  get transactionSource() {
    return this.addForm.get('transactionSource');
  }

  get amount() {
    return this.addForm.get('amount');
  }

  get merchantInfo() {
    return this.addForm.get('merchantInfo');
  }
}
