import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Card {
  card_number: string;
  account_id: string;
  customer_id: string;
  card_status: string;
  expiry_month: string;
  expiry_year: string;
  first_name: string;
  last_name: string;
  credit_limit?: number;
  current_balance?: number;
  email?: string;
}

export interface CardListResponse {
  cards: Card[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private apiUrl = `${environment.apiUrl}/cards`;

  constructor(private http: HttpClient) {}

  getCards(page: number = 1, limit: number = 10, accountId?: string, cardNumber?: string): Observable<CardListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (accountId) {
      params = params.set('accountId', accountId);
    }
    
    if (cardNumber) {
      params = params.set('cardNumber', cardNumber);
    }

    return this.http.get<CardListResponse>(this.apiUrl, { params });
  }

  getCard(cardNumber: string): Observable<Card> {
    return this.http.get<Card>(`${this.apiUrl}/${cardNumber}`);
  }

  updateCard(cardNumber: string, data: Partial<Card>): Observable<Card> {
    return this.http.put<Card>(`${this.apiUrl}/${cardNumber}`, data);
  }
}
