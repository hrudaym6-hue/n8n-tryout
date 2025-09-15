import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <nav>
      <a routerLink="/register">Register</a>
      <a routerLink="/login">Login</a>
      <a routerLink="/account" *ngIf="isLoggedIn()">Account</a>
      <a routerLink="/order" *ngIf="isLoggedIn()">Order</a>
      <a routerLink="/transaction" *ngIf="isLoggedIn()">Transaction</a>
      <button *ngIf="isLoggedIn()" (click)="logout()">Logout</button>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`nav { margin-bottom:20px; } a,button{margin-right:14px;} button {background: none; border: 1px solid #ccc;}`]
})
export class AppComponent {
  constructor(private auth: AuthService) {}

  isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  logout() {
    this.auth.removeToken();
    window.location.href = '/login';
  }
}
