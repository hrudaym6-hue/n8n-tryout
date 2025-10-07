import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TransactionType } from '../models/transaction-type.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionTypeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/transaction-types`;

  getTransactionTypes(typeCodeFilter?: string, descriptionFilter?: string, page: number = 0, size: number = 7): Observable<TransactionType[]> {
    const params: any = { page: page.toString(), size: size.toString() };
    if (typeCodeFilter) {
      params.typeCode = typeCodeFilter;
    }
    if (descriptionFilter) {
      params.description = descriptionFilter;
    }
    return this.http.get<TransactionType[]>(this.apiUrl, { params });
  }

  getTransactionType(typeCode: string): Observable<TransactionType> {
    return this.http.get<TransactionType>(`${this.apiUrl}/${typeCode}`);
  }

  createTransactionType(transactionType: TransactionType): Observable<TransactionType> {
    return this.http.post<TransactionType>(this.apiUrl, transactionType);
  }

  updateTransactionType(typeCode: string, transactionType: TransactionType): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${typeCode}`, transactionType);
  }

  deleteTransactionType(typeCode: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${typeCode}`);
  }
}
