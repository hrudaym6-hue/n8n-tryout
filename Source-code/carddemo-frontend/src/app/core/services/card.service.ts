import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private apiUrl = `${environment.apiUrl}/cards`;

  constructor(private http: HttpClient) {}

  getCards(): Observable<Card[]> {
    return this.http.get<Card[]>(this.apiUrl);
  }

  getCardByNumber(cardNumber: string): Observable<Card> {
    return this.http.get<Card>(`${this.apiUrl}/${cardNumber}`);
  }

  searchCard(cardNumber: string): Observable<Card> {
    return this.http.get<Card>(`${this.apiUrl}/search/${cardNumber}`);
  }

  updateCard(cardNumber: string, card: Partial<Card>): Observable<Card> {
    return this.http.put<Card>(`${this.apiUrl}/${cardNumber}`, card);
  }
}
