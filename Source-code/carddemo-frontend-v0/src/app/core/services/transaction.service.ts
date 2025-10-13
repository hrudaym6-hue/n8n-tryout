import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Transaction {
  transaction_id: string;
  account_id: string;
  card_number: string;
  transaction_type_id: string;
  transaction_category_id: string;
  transaction_source: string;
  transaction_desc: string;
  transaction_amount: number;
  transaction_date: string;
  transaction_time?: string;
  merchant_id?: string;
  merchant_name?: string;
  merchant_city?: string;
  merchant_zip?: string;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  getTransactions(page: number = 1, limit: number = 10, accountId?: string, cardNumber?: string): Observable<TransactionListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (accountId) {
      params = params.set('accountId', accountId);
    }
    
    if (cardNumber) {
      params = params.set('cardNumber', cardNumber);
    }

    return this.http.get<TransactionListResponse>(this.apiUrl, { params });
  }

  getTransaction(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }
}
