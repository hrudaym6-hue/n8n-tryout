import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> { return this.http.get<User[]>(this.apiUrl); }
  getUser(id: number): Observable<User> { return this.http.get<User>(`${this.apiUrl}/${id}`); }
  addUser(user: User): Observable<User> { return this.http.post<User>(this.apiUrl, user); }
  updateUser(id: number, user: User): Observable<any> { return this.http.put(`${this.apiUrl}/${id}`, user); }
  deleteUser(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}
