import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../core/services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../../../core/models/account.model';
import { accountNumberValidator } from '../../../shared/validators/account-number.validator';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss']
})
export class AccountFormComponent implements OnInit {
  form!: FormGroup;
  editMode = false;
  accountId?: number;
  loading = false;
  error?: string;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      userId: ['', [Validators.required]],
      accountNumber: ['', [Validators.required, accountNumberValidator]],
      type: ['savings', [Validators.required]],
      status: ['active', [Validators.required]],
      balance: [0, [Validators.required, Validators.min(0)]]
    });

    this.accountId = Number(this.route.snapshot.paramMap.get('id'));
    this.editMode = Boolean(this.accountId);

    if (this.editMode) {
      this.loading = true;
      this.accountService.getAccount(this.accountId!).subscribe({
        next: (account) => {
          this.form.patchValue(account);
          this.loading = false;
        },
        error: () => { this.error = 'Account not found'; this.loading = false; }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const account: Account = this.form.value;
    
    if (this.editMode) {
      this.accountService.updateAccount(this.accountId!, account).subscribe({
        next: () => this.router.navigate(['/accounts']),
        error: (err) => { this.error = err.error.error || 'Update failed'; this.loading = false; }
      });
    } else {
      this.accountService.addAccount(account).subscribe({
        next: () => this.router.navigate(['/accounts']),
        error: (err) => { this.error = err.error.error || 'Creation failed'; this.loading = false; }
      });
    }
  }
}
