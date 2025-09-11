import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class DataService {
  getReports(): Observable<any[]> {
    return of([
      { title: 'Sales Report', description: 'Monthly sales summary' },
      { title: 'Inventory Report', description: 'Current inventory levels' }
    ]);
  }

  saveEntry(data: any): Observable<any> {
    if (data.field1 && data.field2 && data.field3 >= 0) {
      return of({});
    }
    return throwError(() => new Error('Invalid entry'));
  }
}
