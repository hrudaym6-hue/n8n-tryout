import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Account } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private apiUrl = `${environment.apiUrl}/accounts`;
  constructor(private http: HttpClient) {}

  getAccounts(): Observable<Account[]> { return this.http.get<Account[]>(this.apiUrl); }
  getAccount(id: number): Observable<Account> { return this.http.get<Account>(`${this.apiUrl}/${id}`); }
  addAccount(account: Account): Observable<Account> { return this.http.post<Account>(this.apiUrl, account); }
  updateAccount(id: number, account: Account): Observable<any> { return this.http.put(`${this.apiUrl}/${id}`, account); }
  deleteAccount(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}
