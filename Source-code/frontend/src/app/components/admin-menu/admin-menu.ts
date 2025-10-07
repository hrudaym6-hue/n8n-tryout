import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  id: string;
  label: string;
  route: string;
  key: string;
}

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-menu.html',
  styleUrl: './admin-menu.scss'
})
export class AdminMenu implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  
  menuItems: MenuItem[] = [
    { id: '1', label: 'User Administration', route: '/user-list', key: '1' },
    { id: '2', label: 'Account Management', route: '/account-view', key: '2' },
    { id: '3', label: 'Credit Card Management', route: '/card-list', key: '3' },
    { id: '4', label: 'Transaction Reports', route: '/transaction-list', key: '4' },
    { id: '5', label: 'Authorization Summary', route: '/authorization-summary', key: '5' },
    { id: '6', label: 'Transaction Type Maintenance', route: '/transaction-type-list', key: '6' }
  ];

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/main-menu']);
    }
  }

  selectOption(route: string): void {
    this.router.navigate([route]);
  }

  onExit(): void {
    this.authService.logout();
  }
}
