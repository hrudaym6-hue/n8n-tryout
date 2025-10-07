import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { AccountDetail } from '../../models/account.model';

@Component({
  selector: 'app-account-view',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-view.html',
  styleUrl: './account-view.scss'
})
export class AccountView implements OnInit {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);

  searchForm!: FormGroup;
  accountDetail: AccountDetail | null = null;
  errorMessage = '';
  isLoading = false;

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      accountId: ['', [Validators.required, Validators.maxLength(11)]]
    });
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const accountId = this.searchForm.get('accountId')?.value;
      
      this.accountService.getAccount(accountId).subscribe({
        next: (data) => {
          this.accountDetail = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Account not found. Please verify the Account ID.';
          this.accountDetail = null;
        }
      });
    } else {
      this.errorMessage = 'Please enter a valid Account ID';
    }
  }

  onUpdate(): void {
    if (this.accountDetail) {
      this.router.navigate(['/account-update', this.accountDetail.account.accountId]);
    }
  }

  onBack(): void {
    this.router.navigate(['/main-menu']);
  }
}
