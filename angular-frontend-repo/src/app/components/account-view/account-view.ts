import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/account.model';
import { CustomValidators } from '../../shared/validators';

@Component({
  selector: 'app-account-view',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-view.html',
  styleUrl: './account-view.scss'
})
export class AccountView implements OnInit {
  searchForm!: FormGroup;
  account: Account | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      accountId: ['', [Validators.required, CustomValidators.numeric(), CustomValidators.exactLength(11)]]
    });
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      this.markFormGroupTouched(this.searchForm);
      if (!this.searchForm.get('accountId')?.value) {
        this.errorMessage = 'Account ID is required';
      } else if (this.searchForm.get('accountId')?.hasError('numeric')) {
        this.errorMessage = 'Account ID must be numeric';
      } else if (this.searchForm.get('accountId')?.hasError('exactLength')) {
        this.errorMessage = 'Account ID must be 11 digits long';
      }
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.account = null;

    this.accountService.getAccount(this.searchForm.value.accountId).subscribe({
      next: (account) => {
        this.isLoading = false;
        this.account = account;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Account Not Found';
      }
    });
  }

  onUpdate(): void {
    if (this.account) {
      this.router.navigate(['/account-update'], { 
        queryParams: { accountId: this.account.accountId }
      });
    }
  }

  onClear(): void {
    this.searchForm.reset();
    this.account = null;
    this.errorMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/main-menu']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
