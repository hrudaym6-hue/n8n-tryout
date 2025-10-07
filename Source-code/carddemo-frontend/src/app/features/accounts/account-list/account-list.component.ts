import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService, Account } from '../../../core/services/account.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css'],
  standalone: false
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];
  loading = false;
  errorMessage = '';
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  searchAccountId = '';

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.accountService.getAccounts(
      this.currentPage,
      this.pageSize,
      this.searchAccountId || undefined
    ).subscribe({
      next: (response) => {
        this.accounts = response.accounts;
        this.totalRecords = response.total;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load accounts';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadAccounts();
  }

  onClear(): void {
    this.searchAccountId = '';
    this.currentPage = 1;
    this.loadAccounts();
  }

  viewAccount(accountId: string): void {
    this.router.navigate(['/accounts', accountId]);
  }

  nextPage(): void {
    if (this.currentPage * this.pageSize < this.totalRecords) {
      this.currentPage++;
      this.loadAccounts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadAccounts();
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
