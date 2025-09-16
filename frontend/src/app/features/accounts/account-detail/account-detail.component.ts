import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { Account } from '../../../core/models/account.model';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent implements OnInit {
  account?: Account;
  loading = true;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    const accountId = Number(this.route.snapshot.paramMap.get('id'));
    this.accountService.getAccount(accountId).subscribe({
      next: (account) => { this.account = account; this.loading = false; },
      error: () => { this.error = 'Account not found'; this.loading = false; }
    });
  }
}
