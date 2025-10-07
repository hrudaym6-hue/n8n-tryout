import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Card, CardListItem } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cards`;

  getCardsByAccount(accountId: string, page: number = 0, size: number = 10): Observable<CardListItem[]> {
    return this.http.get<CardListItem[]>(`${this.apiUrl}/account/${accountId}`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  getCard(cardNumber: string): Observable<Card> {
    return this.http.get<Card>(`${this.apiUrl}/${cardNumber}`);
  }

  updateCard(cardNumber: string, card: Card): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${cardNumber}`, card);
  }
}
