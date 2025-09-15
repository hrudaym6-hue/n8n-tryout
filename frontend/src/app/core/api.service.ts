import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  post<T>(url: string, payload: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${url}`, payload);
  }
}
