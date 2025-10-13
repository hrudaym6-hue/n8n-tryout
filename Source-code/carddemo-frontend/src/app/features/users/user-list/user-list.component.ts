import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  errorMessage = '';
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;

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
    
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.totalPages = Math.ceil(users.length / this.pageSize);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load users';
        this.isLoading = false;
      }
    });
  }

  get paginatedUsers(): User[] {
    const start = this.currentPage * this.pageSize;
    return this.users.slice(start, start + this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  addUser(): void {
    this.router.navigate(['/users/add']);
  }

  updateUser(userId: string): void {
    this.router.navigate(['/users', userId, 'update']);
  }

  deleteUser(userId: string): void {
    this.router.navigate(['/users', userId, 'delete']);
  }

  goBack(): void {
    this.router.navigate(['/admin-menu']);
  }
}
