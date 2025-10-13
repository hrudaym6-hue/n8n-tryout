import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.css']
})
export class UserDeleteComponent implements OnInit {
  user: User | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUser(userId);
    }
  }

  loadUser(userId: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load user';
        this.isLoading = false;
      }
    });
  }

  confirmDelete(): void {
    if (!this.user) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.userService.deleteUser(this.user.userId).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/users']);
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete user';
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }
}
