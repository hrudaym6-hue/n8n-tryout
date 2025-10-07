import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Account {
  account_id: string;
  customer_id: string;
  account_status: string;
  credit_limit: number;
  cash_credit_limit: number;
  current_balance: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
}

export interface AccountListResponse {
  accounts: Account[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = `${environment.apiUrl}/accounts`;

  constructor(private http: HttpClient) {}

  getAccounts(page: number = 1, limit: number = 10, accountId?: string): Observable<AccountListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (accountId) {
      params = params.set('accountId', accountId);
    }

    return this.http.get<AccountListResponse>(this.apiUrl, { params });
  }

  getAccount(id: string): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${id}`);
  }

  updateAccount(id: string, data: Partial<Account>): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/${id}`, data);
  }
}
