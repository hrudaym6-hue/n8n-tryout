import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Authorization {
  authorization_id: string;
  account_id: string;
  card_number: string;
  merchant_id: string;
  merchant_name: string;
  authorization_amount: number;
  authorization_status: string;
  authorization_date: string;
  authorization_time?: string;
}

export interface AuthorizationListResponse {
  authorizations: Authorization[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private apiUrl = `${environment.apiUrl}/authorizations`;

  constructor(private http: HttpClient) {}

  getAuthorizations(page: number = 1, limit: number = 10, accountId?: string): Observable<AuthorizationListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (accountId) {
      params = params.set('accountId', accountId);
    }

    return this.http.get<AuthorizationListResponse>(this.apiUrl, { params });
  }

  getAuthorization(id: string): Observable<Authorization> {
    return this.http.get<Authorization>(`${this.apiUrl}/${id}`);
  }
}
