import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Transaction, TransactionListResponse, TransactionType } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`;
  private typesUrl = `${environment.apiUrl}/transaction-types`;

  constructor(private http: HttpClient) {}

  getTransactions(
    page: number = 1,
    limit: number = 10,
    accountId?: string,
    cardNumber?: string,
    startDate?: string,
    endDate?: string
  ): Observable<TransactionListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (accountId) params = params.set('accountId', accountId);
    if (cardNumber) params = params.set('cardNumber', cardNumber);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<TransactionListResponse>(this.apiUrl, { params });
  }

  getTransactionById(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  getTransactionTypes(): Observable<TransactionType[]> {
    return this.http.get<TransactionType[]>(this.typesUrl);
  }

  getTransactionTypeByCode(code: string): Observable<TransactionType> {
    return this.http.get<TransactionType>(`${this.typesUrl}/${code}`);
  }

  createTransactionType(data: { typeCode: string; typeDescription: string }): Observable<TransactionType> {
    return this.http.post<TransactionType>(this.typesUrl, data);
  }

  updateTransactionType(code: string, data: { typeDescription: string }): Observable<TransactionType> {
    return this.http.put<TransactionType>(`${this.typesUrl}/${code}`, data);
  }

  deleteTransactionType(code: string): Observable<void> {
    return this.http.delete<void>(`${this.typesUrl}/${code}`);
  }
}
