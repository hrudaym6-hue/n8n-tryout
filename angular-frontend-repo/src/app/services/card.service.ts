import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Card, CardUpdateRequest } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/cards`;

  constructor(private http: HttpClient) {}

  getCard(cardNumber: string): Observable<Card> {
    return this.http.get<Card>(`${this.apiUrl}/${cardNumber}`);
  }

  updateCard(request: CardUpdateRequest): Observable<Card> {
    return this.http.put<Card>(`${this.apiUrl}/${request.cardNumber}`, request);
  }

  getCardsByAccount(accountId: string): Observable<Card[]> {
    const params = new HttpParams().set('accountId', accountId);
    return this.http.get<Card[]>(this.apiUrl, { params });
  }

  searchCards(accountId?: string, page: number = 0, size: number = 10): Observable<{ content: Card[], totalElements: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (accountId) {
      params = params.set('accountId', accountId);
    }

    return this.http.get<{ content: Card[], totalElements: number }>(this.apiUrl, { params });
  }
}
