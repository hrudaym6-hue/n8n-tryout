import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  title: string;
  route: string;
  icon: string;
  adminOnly: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  menuItems: MenuItem[] = [
    { title: 'Account Management', route: '/accounts', icon: '👤', adminOnly: false },
    { title: 'Card Management', route: '/cards', icon: '💳', adminOnly: false },
    { title: 'Transaction History', route: '/transactions', icon: '📊', adminOnly: false },
    { title: 'Authorizations', route: '/authorizations', icon: '✓', adminOnly: false },
    { title: 'Transaction Types', route: '/transaction-types', icon: '⚙️', adminOnly: true },
    { title: 'User Management', route: '/users', icon: '👥', adminOnly: true }
  ];

  currentUser = computed(() => this.authService.currentUser());
  isAdmin = computed(() => this.authService.isAdmin());
  
  availableMenuItems = computed(() => {
    if (this.isAdmin()) {
      return this.menuItems;
    }
    return this.menuItems.filter(item => !item.adminOnly);
  });

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
  }
}
