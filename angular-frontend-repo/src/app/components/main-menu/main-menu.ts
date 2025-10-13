import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-main-menu',
  imports: [CommonModule],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.scss'
})
export class MainMenu implements OnInit {
  currentUser: User | null = null;

  menuOptions = [
    { id: 1, label: 'View Account', route: '/account-view' },
    { id: 2, label: 'View Card List', route: '/card-list' },
    { id: 3, label: 'View Transaction List', route: '/transaction-list' },
    { id: 4, label: 'View Authorization Summary', route: '/authorization-summary' },
    { id: 5, label: 'Bill Payment', route: '/bill-payment' },
    { id: 6, label: 'Generate Reports', route: '/report-generation' }
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
