import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css'],
  standalone: false
})
export class AdminMenuComponent implements OnInit {
  selectedOption = '';
  errorMessage = '';
  userName = '';

  menuOptions = [
    { value: '1', label: 'User List', route: '/admin/users' },
    { value: '2', label: 'User Add', route: '/admin/users/add' },
    { value: '3', label: 'User Update', route: '/admin/users/update' },
    { value: '4', label: 'User Delete', route: '/admin/users/delete' }
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
      this.errorMessage = 'Please enter a valid option number (1-4)';
    }
  }

  onSignOff(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
