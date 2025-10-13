import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, UserDetail } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.css'],
  standalone: false
})
export class UserDeleteComponent implements OnInit {
  user: UserDetail | null = null;
  loading = false;
  loadingUser = false;
  errorMessage = '';
  successMessage = '';
  userId = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      if (this.userId) {
        this.loadUser();
      } else {
        this.errorMessage = 'User ID not provided';
      }
    });
  }

  loadUser(): void {
    this.loadingUser = true;
    this.errorMessage = '';

    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.loadingUser = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load user. Please try again.';
        console.error('Error loading user:', error);
        this.loadingUser = false;
      }
    });
  }

  onConfirmDelete(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.deleteUser(this.userId).subscribe({
      next: () => {
        this.successMessage = 'User deleted successfully!';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/admin/users']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Failed to delete user. Please try again.';
        console.error('Error deleting user:', error);
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/users']);
  }
}
