import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReportRequest, ReportResponse } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/reports`;

  constructor(private http: HttpClient) {}

  generateTransactionReport(request: ReportRequest): Observable<ReportResponse> {
    return this.http.post<ReportResponse>(`${this.apiUrl}/transactions`, request);
  }

  generateReport(request: ReportRequest): Observable<ReportResponse> {
    return this.http.post<ReportResponse>(this.apiUrl, request);
  }
}
