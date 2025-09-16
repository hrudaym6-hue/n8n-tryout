import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`;
  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> { return this.http.get<Transaction[]>(this.apiUrl); }
  getTransaction(id: number): Observable<Transaction> { return this.http.get<Transaction>(`${this.apiUrl}/${id}`); }
  addTransaction(transaction: Transaction): Observable<Transaction> { return this.http.post<Transaction>(this.apiUrl, transaction); }
}
