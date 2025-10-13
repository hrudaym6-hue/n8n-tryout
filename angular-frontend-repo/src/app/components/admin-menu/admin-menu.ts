import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-menu',
  imports: [CommonModule],
  templateUrl: './admin-menu.html',
  styleUrl: './admin-menu.scss'
})
export class AdminMenu implements OnInit {
  currentUser: User | null = null;

  menuOptions = [
    { id: 1, label: 'User Management', route: '/user-list' },
    { id: 2, label: 'Transaction Type Management', route: '/transaction-type-list' },
    { id: 3, label: 'Back to Main Menu', route: '/main-menu' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}
