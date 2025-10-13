import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css']
})
export class AdminMenuComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  navigateToAccounts(): void {
    this.router.navigate(['/accounts']);
  }

  navigateToCards(): void {
    this.router.navigate(['/cards']);
  }

  navigateToTransactions(): void {
    this.router.navigate(['/transactions']);
  }

  navigateToBillPayment(): void {
    this.router.navigate(['/bill-payment']);
  }

  navigateToUsers(): void {
    this.router.navigate(['/users']);
  }

  navigateToReports(): void {
    this.router.navigate(['/reports']);
  }

  navigateToAuthorizations(): void {
    this.router.navigate(['/authorizations']);
  }

  signOff(): void {
    this.authService.logout();
  }
}
