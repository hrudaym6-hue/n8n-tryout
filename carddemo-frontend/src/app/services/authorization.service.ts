import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Authorization, AuthorizationListResponse } from '../models/authorization.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private apiUrl = `${environment.apiUrl}/authorizations`;

  constructor(private http: HttpClient) {}

  getAuthorizations(
    page: number = 1,
    limit: number = 10,
    accountId?: string,
    cardNumber?: string
  ): Observable<AuthorizationListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (accountId) params = params.set('accountId', accountId);
    if (cardNumber) params = params.set('cardNumber', cardNumber);

    return this.http.get<AuthorizationListResponse>(this.apiUrl, { params });
  }
}
