import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Transaction, TransactionListItem } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/transactions`;

  getTransactionsByCard(cardNumber: string, page: number = 0, size: number = 10): Observable<TransactionListItem[]> {
    return this.http.get<TransactionListItem[]>(`${this.apiUrl}/card/${cardNumber}`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  getTransaction(transactionId: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${transactionId}`);
  }

  createTransaction(transaction: Partial<Transaction>): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }
}
