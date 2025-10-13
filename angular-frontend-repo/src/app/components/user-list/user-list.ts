import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserList implements OnInit {
  users: User[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.isLoading = false;
        this.users = users;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load users';
      }
    });
  }

  onAdd(): void {
    this.router.navigate(['/user-add']);
  }

  onUpdate(user: User): void {
    this.router.navigate(['/user-update'], { 
      queryParams: { userId: user.userId }
    });
  }

  onDelete(user: User): void {
    this.router.navigate(['/user-delete'], { 
      queryParams: { userId: user.userId }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin-menu']);
  }
}
