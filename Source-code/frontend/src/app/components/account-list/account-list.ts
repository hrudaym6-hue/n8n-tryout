import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService, AccountListResponse } from '../../services/account.service';
import { AccountDetail } from '../../models/account.model';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-list.html',
  styleUrl: './account-list.scss'
})
export class AccountList implements OnInit {
  private accountService = inject(AccountService);
  private router = inject(Router);

  accounts: AccountDetail[] = [];
  currentPage = 1;
  pageSize = 10;
  totalAccounts = 0;
  totalPages = 0;
  errorMessage = '';
  isLoading = false;

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.accountService.getAllAccounts(this.currentPage, this.pageSize).subscribe({
      next: (response: AccountListResponse) => {
        this.accounts = response.accounts;
        this.totalAccounts = response.total;
        this.totalPages = Math.ceil(response.total / this.pageSize);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to load accounts. Please try again.';
      }
    });
  }

  onViewAccount(accountId: string): void {
    this.router.navigate(['/account-view'], { queryParams: { accountId } });
  }

  onUpdateAccount(accountId: string): void {
    this.router.navigate(['/account-update', accountId]);
  }

  onAddAccount(): void {
    this.router.navigate(['/account-add']);
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadAccounts();
    }
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadAccounts();
    }
  }

  onBack(): void {
    this.router.navigate(['/main-menu']);
  }
}
