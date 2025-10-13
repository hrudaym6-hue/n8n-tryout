import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Authorization } from '../models/authorization.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private apiUrl = `${environment.apiUrl}/authorizations`;

  constructor(private http: HttpClient) {}

  getAuthorizations(): Observable<Authorization[]> {
    return this.http.get<Authorization[]>(this.apiUrl);
  }

  getAuthorizationById(authorizationKey: string): Observable<Authorization> {
    return this.http.get<Authorization>(`${this.apiUrl}/${authorizationKey}`);
  }

  reportFraud(authorizationKey: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${authorizationKey}/fraud`, {});
  }

  removeFraudFlag(authorizationKey: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${authorizationKey}/fraud`);
  }
}
