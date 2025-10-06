import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.css'
})
export class AccountListComponent implements OnInit {
  accounts = signal<Account[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  searchAccountId = signal<string>('');
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalRecords = signal<number>(0);
  pageSize = 10;

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const accountId = this.searchAccountId() || undefined;

    this.accountService.getAccounts(this.currentPage(), this.pageSize, accountId).subscribe({
      next: (response) => {
        this.accounts.set(response.accounts);
        this.totalRecords.set(response.total);
        this.totalPages.set(Math.ceil(response.total / this.pageSize));
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Failed to load accounts');
        this.isLoading.set(false);
      }
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadAccounts();
  }

  onClearSearch(): void {
    this.searchAccountId.set('');
    this.currentPage.set(1);
    this.loadAccounts();
  }

  viewAccount(accountId: number): void {
    this.router.navigate(['/accounts', accountId]);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadAccounts();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadAccounts();
    }
  }

  getStatusLabel(status: string): string {
    return status === 'Y' ? 'Active' : 'Inactive';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
