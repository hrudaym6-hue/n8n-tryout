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
  selector: 'app-main-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.scss'
})
export class MainMenu implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  
  menuItems: MenuItem[] = [
    { id: '1', label: 'View Account', route: '/account-view', key: '1' },
    { id: '2', label: 'View Credit Cards', route: '/card-list', key: '2' },
    { id: '3', label: 'View Transactions', route: '/transaction-list', key: '3' },
    { id: '4', label: 'Bill Payment', route: '/bill-payment', key: '4' },
    { id: '5', label: 'Generate Report', route: '/report-generation', key: '5' }
  ];

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/signin']);
    }
  }

  selectOption(route: string): void {
    this.router.navigate([route]);
  }

  onExit(): void {
    this.authService.logout();
  }
}
