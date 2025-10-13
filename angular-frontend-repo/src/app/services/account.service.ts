import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Account, AccountUpdateRequest } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/accounts`;

  constructor(private http: HttpClient) {}

  getAccount(accountId: string): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${accountId}`);
  }

  updateAccount(request: AccountUpdateRequest): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/${request.accountId}`, request);
  }

  searchAccounts(accountId?: string, page: number = 0, size: number = 10): Observable<{ content: Account[], totalElements: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (accountId) {
      params = params.set('accountId', accountId);
    }

    return this.http.get<{ content: Account[], totalElements: number }>(this.apiUrl, { params });
  }
}
