import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BillPayment {
  accountId: string;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class BillPaymentService {
  private apiUrl = `${environment.apiUrl}/bill-payment`;

  constructor(private http: HttpClient) {}

  processPayment(payment: BillPayment): Observable<void> {
    return this.http.post<void>(this.apiUrl, payment);
  }
}
