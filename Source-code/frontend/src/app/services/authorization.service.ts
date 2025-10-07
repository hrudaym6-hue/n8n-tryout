import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthorizationSummary, AuthorizationDetail } from '../models/authorization.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/authorizations`;

  getAuthorizationsByAccount(accountId: string, page: number = 0, size: number = 10): Observable<AuthorizationSummary[]> {
    return this.http.get<AuthorizationSummary[]>(`${this.apiUrl}/account/${accountId}`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  getAuthorization(authorizationId: string): Observable<AuthorizationDetail> {
    return this.http.get<AuthorizationDetail>(`${this.apiUrl}/${authorizationId}`);
  }

  updateFraudFlag(authorizationId: string, fraudFlag: 'Y' | 'N'): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${authorizationId}/fraud`, { fraudFlag });
  }
}
