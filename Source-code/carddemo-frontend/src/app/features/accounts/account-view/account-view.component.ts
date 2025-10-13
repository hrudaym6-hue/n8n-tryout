import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../core/services/account.service';
import { AuthService } from '../../../core/services/auth.service';
import { Account } from '../../../core/models/account.model';

@Component({
  selector: 'app-account-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent implements OnInit {
  account: Account | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const accountId = this.route.snapshot.paramMap.get('id');
    if (accountId) {
      this.loadAccount(accountId);
    }
  }

  loadAccount(accountId: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.accountService.getAccountById(accountId).subscribe({
      next: (account) => {
        this.account = account;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.status === 404 ? 'Account not found' : 'Failed to load account';
        this.isLoading = false;
      }
    });
  }

  updateAccount(): void {
    if (this.account) {
      this.router.navigate(['/accounts', this.account.accountId, 'update']);
    }
  }

  goBack(): void {
    this.router.navigate(['/accounts']);
  }
}
