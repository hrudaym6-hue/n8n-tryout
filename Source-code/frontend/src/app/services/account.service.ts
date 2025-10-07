import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AccountDetail, Account, Customer } from '../models/account.model';

export interface AccountListResponse {
  accounts: AccountDetail[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/accounts`;

  getAllAccounts(page: number = 1, pageSize: number = 10): Observable<AccountListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<AccountListResponse>(this.apiUrl, { params });
  }

  getAccount(accountId: string): Observable<AccountDetail> {
    return this.http.get<AccountDetail>(`${this.apiUrl}/${accountId}`);
  }

  createAccount(account: Account, customer: Customer): Observable<AccountDetail> {
    return this.http.post<AccountDetail>(this.apiUrl, { account, customer });
  }

  updateAccount(accountId: string, account: Account, customer: Customer): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${accountId}`, { account, customer });
  }
}
