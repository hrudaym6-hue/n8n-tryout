import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/account.model';
import { CustomValidators } from '../../shared/validators';

@Component({
  selector: 'app-account-update',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-update.html',
  styleUrl: './account-update.scss'
})
export class AccountUpdate implements OnInit {
  searchForm!: FormGroup;
  updateForm!: FormGroup;
  account: Account | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  isUpdating: boolean = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      accountId: ['', [Validators.required, CustomValidators.numeric(), CustomValidators.exactLength(11)]]
    });

    this.updateForm = this.fb.group({
      accountStatus: ['', [Validators.required]],
      creditLimit: ['', [Validators.required, CustomValidators.numeric()]],
      expirationDate: ['', [Validators.required, CustomValidators.dateFormat()]],
      reissueDate: ['', [CustomValidators.dateFormat()]]
    });

    this.route.queryParams.subscribe(params => {
      if (params['accountId']) {
        this.searchForm.patchValue({ accountId: params['accountId'] });
        this.onSearch();
      }
    });
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      this.markFormGroupTouched(this.searchForm);
      if (!this.searchForm.get('accountId')?.value) {
        this.errorMessage = 'Account ID is required';
      } else if (this.searchForm.get('accountId')?.hasError('exactLength')) {
        this.errorMessage = 'Account ID must be 11 digits long';
      }
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.accountService.getAccount(this.searchForm.value.accountId).subscribe({
      next: (account) => {
        this.isLoading = false;
        this.account = account;
        this.updateForm.patchValue({
          accountStatus: account.accountStatus,
          creditLimit: account.creditLimit,
          expirationDate: account.expirationDate,
          reissueDate: account.reissueDate
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Account Not Found';
      }
    });
  }

  onUpdate(): void {
    if (this.updateForm.invalid) {
      this.markFormGroupTouched(this.updateForm);
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    if (!this.account) {
      this.errorMessage = 'No account loaded';
      return;
    }

    this.isUpdating = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateRequest = {
      accountId: this.account.accountId,
      ...this.updateForm.value
    };

    this.accountService.updateAccount(updateRequest).subscribe({
      next: (account) => {
        this.isUpdating = false;
        this.account = account;
        this.successMessage = 'Account updated successfully';
      },
      error: (error) => {
        this.isUpdating = false;
        this.errorMessage = error.error?.message || 'Failed to update account';
      }
    });
  }

  onClear(): void {
    this.searchForm.reset();
    this.updateForm.reset();
    this.account = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/account-view']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
