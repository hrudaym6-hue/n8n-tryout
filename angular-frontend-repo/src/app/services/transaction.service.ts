import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Transaction, TransactionAddRequest, TransactionType } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/transactions`;
  private typeApiUrl = `${environment.apiUrl}/${environment.apiVersion}/transaction-types`;

  constructor(private http: HttpClient) {}

  getTransaction(transactionId: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${transactionId}`);
  }

  addTransaction(request: TransactionAddRequest): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, request);
  }

  getTransactionsByAccount(accountId: string): Observable<Transaction[]> {
    const params = new HttpParams().set('accountId', accountId);
    return this.http.get<Transaction[]>(this.apiUrl, { params });
  }

  getTransactionsByCard(cardNumber: string): Observable<Transaction[]> {
    const params = new HttpParams().set('cardNumber', cardNumber);
    return this.http.get<Transaction[]>(this.apiUrl, { params });
  }

  searchTransactions(cardNumber?: string, page: number = 0, size: number = 10): Observable<{ content: Transaction[], totalElements: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (cardNumber) {
      params = params.set('cardNumber', cardNumber);
    }

    return this.http.get<{ content: Transaction[], totalElements: number }>(this.apiUrl, { params });
  }

  getTransactionTypes(page: number = 0, size: number = 7, typeCode?: string, description?: string): Observable<{ content: TransactionType[], totalElements: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (typeCode) {
      params = params.set('typeCode', typeCode);
    }
    if (description) {
      params = params.set('description', description);
    }

    return this.http.get<{ content: TransactionType[], totalElements: number }>(this.typeApiUrl, { params });
  }

  updateTransactionType(typeCode: string, description: string): Observable<TransactionType> {
    return this.http.put<TransactionType>(`${this.typeApiUrl}/${typeCode}`, { typeCode, description });
  }

  addTransactionType(typeCode: string, description: string): Observable<TransactionType> {
    return this.http.post<TransactionType>(this.typeApiUrl, { typeCode, description });
  }

  deleteTransactionType(typeCode: string): Observable<void> {
    return this.http.delete<void>(`${this.typeApiUrl}/${typeCode}`);
  }
}
