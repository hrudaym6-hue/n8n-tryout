import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
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

  signOff(): void {
    this.authService.logout();
  }
}
