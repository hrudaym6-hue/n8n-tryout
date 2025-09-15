import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor() {
    console.log('API Service initialized with baseUrl:', this.baseUrl);
  }

  post<T>(url: string, payload: any): Observable<T> {
    const fullUrl = `${this.baseUrl}${url}`;
    console.log('API Service - Making POST request to:', fullUrl);
    console.log('API Service - Payload:', JSON.stringify(payload));
    
    return new Observable<T>(observer => {
      console.log('API Service - Starting fetch request...');
      
      fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(response => {
        console.log('API Service - Fetch response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('API Service - Success response:', data);
        observer.next(data as T);
        observer.complete();
      })
      .catch(error => {
        console.error('API Service - Fetch error:', error);
        observer.error(error);
      });
    });
  }
}
