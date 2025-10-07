import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BillPaymentRequest {
  accountId: string;
}

export interface BillPaymentResponse {
  transactionId: string;
  amount: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class BillPayService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/bill-pay`;

  processBillPayment(request: BillPaymentRequest): Observable<BillPaymentResponse> {
    return this.http.post<BillPaymentResponse>(this.apiUrl, request);
  }
}
