import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, LoginRequest, LoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        this.setSession(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(environment.authTokenKey);
    localStorage.removeItem(environment.currentUserKey);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/signin']);
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.userType === 'A';
  }

  getToken(): string | null {
    return localStorage.getItem(environment.authTokenKey);
  }

  private setSession(authResult: LoginResponse): void {
    localStorage.setItem(environment.authTokenKey, authResult.token);
    localStorage.setItem(environment.currentUserKey, JSON.stringify(authResult.user));
    this.currentUser.set(authResult.user);
    this.isAuthenticated.set(true);
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(environment.authTokenKey);
    const userStr = localStorage.getItem(environment.currentUserKey);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch (e) {
        this.logout();
      }
    }
  }
}
