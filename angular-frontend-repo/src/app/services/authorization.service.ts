import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Authorization, AuthorizationUpdateRequest } from '../models/authorization.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/authorizations`;

  constructor(private http: HttpClient) {}

  getAuthorization(authorizationId: string): Observable<Authorization> {
    return this.http.get<Authorization>(`${this.apiUrl}/${authorizationId}`);
  }

  getAuthorizations(): Observable<Authorization[]> {
    return this.http.get<Authorization[]>(this.apiUrl);
  }

  updateFraudFlag(request: AuthorizationUpdateRequest): Observable<Authorization> {
    return this.http.put<Authorization>(`${this.apiUrl}/${request.authorizationId}/fraud`, request);
  }

  searchAuthorizations(accountId?: string, page: number = 0, size: number = 10): Observable<{ content: Authorization[], totalElements: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (accountId) {
      params = params.set('accountId', accountId);
    }

    return this.http.get<{ content: Authorization[], totalElements: number }>(this.apiUrl, { params });
  }
}
