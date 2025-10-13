import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ReportRequest {
  startDate: string;
  endDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  generateTransactionReport(request: ReportRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/transactions`, request);
  }
}
