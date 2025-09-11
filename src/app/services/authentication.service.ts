import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly dummyUser = { username: 'admin', password: 'admin' };
  private isLoggedIn = false;

  login(username: string, password: string): Observable<any> {
    if (username === this.dummyUser.username && password === this.dummyUser.password) {
      this.isLoggedIn = true;
      return of(true);
    }
    return throwError(() => new Error('Invalid credentials'));
  }

  logout(): void {
    this.isLoggedIn = false;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
