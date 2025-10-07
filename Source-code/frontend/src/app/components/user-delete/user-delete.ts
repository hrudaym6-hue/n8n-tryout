import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-delete.html',
  styleUrl: './user-delete.scss'
})
export class UserDelete implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userDetail: User | null = null;
  errorMessage = '';
  successMessage = '';
  isLoading = true;
  isDeleting = false;

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    if (userId) {
      this.loadUser(userId);
    }
  }

  loadUser(userId: string): void {
    this.userService.getUser(userId).subscribe({
      next: (data) => {
        this.userDetail = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error loading user details.';
      }
    });
  }

  onConfirmDelete(): void {
    if (this.userDetail) {
      this.isDeleting = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.userService.deleteUser(this.userDetail.userId).subscribe({
        next: () => {
          this.isDeleting = false;
          this.successMessage = 'User deleted successfully!';
          setTimeout(() => this.router.navigate(['/user-list']), 2000);
        },
        error: (error) => {
          this.isDeleting = false;
          this.errorMessage = error.error?.message || 'Error deleting user. Please try again.';
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/user-list']);
  }
}
