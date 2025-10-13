import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, UserDetail, UserListResponse } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: false
})
export class UserListComponent implements OnInit {
  users: UserDetail[] = [];
  loading = false;
  errorMessage = '';
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  searchUserId = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.userService.getUsers(this.currentPage, this.pageSize, this.searchUserId || undefined).subscribe({
      next: (response: UserListResponse) => {
        this.users = response.users;
        this.totalRecords = response.total;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load users. Please try again.';
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  onClearSearch(): void {
    this.searchUserId = '';
    this.currentPage = 1;
    this.loadUsers();
  }

  onAddUser(): void {
    this.router.navigate(['/admin/users/add']);
  }

  onUpdateUser(userId: string): void {
    this.router.navigate(['/admin/users/update'], { queryParams: { userId } });
  }

  onDeleteUser(userId: string): void {
    this.router.navigate(['/admin/users/delete'], { queryParams: { userId } });
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  onNextPage(): void {
    const totalPages = Math.ceil(this.totalRecords / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  onBackToMenu(): void {
    this.router.navigate(['/admin/menu']);
  }
}
