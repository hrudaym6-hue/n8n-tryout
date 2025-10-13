import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BillPayment, BillPaymentRequest } from '../models/bill-payment.model';

@Injectable({
  providedIn: 'root'
})
export class BillPaymentService {
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/bill-payments`;

  constructor(private http: HttpClient) {}

  getAccountBalance(accountId: string): Observable<BillPayment> {
    return this.http.get<BillPayment>(`${this.apiUrl}/${accountId}`);
  }

  processPayment(request: BillPaymentRequest): Observable<BillPayment> {
    return this.http.post<BillPayment>(this.apiUrl, request);
  }

  createPayment(request: BillPaymentRequest): Observable<BillPayment> {
    return this.processPayment(request);
  }
}
