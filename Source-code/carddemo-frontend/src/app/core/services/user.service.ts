import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserDetail {
  user_id: string;
  first_name: string;
  last_name: string;
  user_type: string;
  password?: string;
}

export interface UserListResponse {
  users: UserDetail[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(page: number = 1, limit: number = 10, userId?: string): Observable<UserListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (userId) {
      params = params.set('userId', userId);
    }

    return this.http.get<UserListResponse>(this.apiUrl, { params });
  }

  getUser(userId: string): Observable<UserDetail> {
    return this.http.get<UserDetail>(`${this.apiUrl}/${userId}`);
  }

  createUser(user: UserDetail): Observable<UserDetail> {
    return this.http.post<UserDetail>(this.apiUrl, user);
  }

  updateUser(userId: string, user: Partial<UserDetail>): Observable<UserDetail> {
    return this.http.put<UserDetail>(`${this.apiUrl}/${userId}`, user);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
}
