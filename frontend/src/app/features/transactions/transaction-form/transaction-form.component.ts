import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction.service';
import { Router } from '@angular/router';
import { Transaction } from '../../../core/models/transaction.model';
import { transactionAmountValidator } from '../../../shared/validators/transaction-amount.validator';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error?: string;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      accountId: ['', [Validators.required]],
      type: ['deposit', [Validators.required]],
      amount: ['', [Validators.required, transactionAmountValidator]],
      approvedByManager: [false]
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const transaction: Transaction = this.form.value;
    
    this.transactionService.addTransaction(transaction).subscribe({
      next: () => this.router.navigate(['/transactions']),
      error: (err) => { this.error = err.error.error || 'Creation failed'; this.loading = false; }
    });
  }
}
