import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AccountDetail, Account, Customer } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/accounts`;

  getAccount(accountId: string): Observable<AccountDetail> {
    return this.http.get<AccountDetail>(`${this.apiUrl}/${accountId}`);
  }

  updateAccount(accountId: string, account: Account, customer: Customer): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${accountId}`, { account, customer });
  }
}
