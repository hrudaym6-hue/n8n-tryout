import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { Account } from '../../../core/models/account.model';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];
  loading = true;
  error?: string;
  userId?: number;

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.queryParamMap.get('userId'));
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = this.userId 
          ? accounts.filter(acc => acc.userId === this.userId)
          : accounts;
        this.loading = false;
      },
      error: (err) => { this.loading = false; this.error = 'Failed to load accounts'; }
    });
  }

  deleteAccount(id: number) {
    if (confirm('Delete this account?')) {
      this.accountService.deleteAccount(id).subscribe({
        next: () => this.loadAccounts()
      });
    }
  }
}
