import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { AccountDetail } from '../../models/account.model';

@Component({
  selector: 'app-account-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-update.html',
  styleUrl: './account-update.scss'
})
export class AccountUpdate implements OnInit {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  accountForm!: FormGroup;
  accountDetail: AccountDetail | null = null;
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;
  isLoading = true;

  ngOnInit(): void {
    const accountId = this.route.snapshot.paramMap.get('id');
    if (accountId) {
      this.loadAccount(accountId);
    }

    this.accountForm = this.fb.group({
      creditLimit: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      cashCreditLimit: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    });
  }

  loadAccount(accountId: string): void {
    this.accountService.getAccount(accountId).subscribe({
      next: (data) => {
        this.accountDetail = data;
        this.accountForm.patchValue({
          creditLimit: data.account.creditLimit,
          cashCreditLimit: data.account.cashCreditLimit
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error loading account details.';
      }
    });
  }

  onSubmit(): void {
    if (this.accountForm.valid && this.accountDetail) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const updatedAccount = {
        ...this.accountDetail.account,
        creditLimit: this.accountForm.get('creditLimit')?.value,
        cashCreditLimit: this.accountForm.get('cashCreditLimit')?.value
      };

      this.accountService.updateAccount(
        this.accountDetail.account.accountId, 
        updatedAccount, 
        this.accountDetail.customer
      ).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.successMessage = 'Account updated successfully!';
          setTimeout(() => this.router.navigate(['/account-view']), 2000);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Error updating account. Please try again.';
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/account-view']);
  }
}
