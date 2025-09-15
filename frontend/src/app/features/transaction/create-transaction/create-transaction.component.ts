import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.css']
})
export class CreateTransactionComponent {
  form: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  transactionTypes = [
    { value: 'deposit', label: 'Deposit' },
    { value: 'withdrawal', label: 'Withdrawal' },
    { value: 'transfer', label: 'Transfer' }
  ];

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      account_id: ['', Validators.required],
      type: ['deposit', Validators.required],
      amount: ['', [Validators.required, Validators.min(1), Validators.max(10000)]]
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    this.api.post<any>('/api/transactions', this.form.value).subscribe({
      next: () => {
        this.success = 'Transaction created!';
        this.form.reset({type:'deposit'});
      },
      error: err => {
        this.error = err.error?.message || 'Transaction failed';
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}
