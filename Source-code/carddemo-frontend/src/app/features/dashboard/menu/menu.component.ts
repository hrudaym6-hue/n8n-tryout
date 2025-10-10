import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: false
})
export class MenuComponent implements OnInit {
  selectedOption = '';
  errorMessage = '';
  userName = '';

  menuOptions = [
    { value: '1', label: 'Account', route: '/accounts' },
    { value: '2', label: 'Credit Card', route: '/cards' },
    { value: '3', label: 'Bill Pay', route: '/bill-payment' },
    { value: '4', label: 'Transaction', route: '/transactions' },
    { value: '5', label: 'Report', route: '/reports' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.userName = `${user.firstName} ${user.lastName}`;
    }
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.selectedOption) {
      this.errorMessage = 'Please enter a valid option number';
      return;
    }

    const option = this.menuOptions.find(opt => opt.value === this.selectedOption);
    if (option) {
      this.router.navigate([option.route]);
    } else {
      this.errorMessage = 'Please enter a valid option number (1-5)';
    }
  }

  onSignOff(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.router.navigate(['/login']);
      }
    });
  }
}
