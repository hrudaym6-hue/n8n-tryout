import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserList implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  searchForm!: FormGroup;
  users: User[] = [];
  errorMessage = '';
  isLoading = false;
  currentPage = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchCriteria: ['']
    });
    this.loadUsers();
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const searchCriteria = this.searchForm.get('searchCriteria')?.value;

    this.userService.getUsers(searchCriteria, this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error retrieving users. Please try again.';
        this.users = [];
      }
    });
  }

  addUser(): void {
    this.router.navigate(['/user-add']);
  }

  updateUser(userId: string): void {
    this.router.navigate(['/user-update', userId]);
  }

  deleteUser(userId: string): void {
    this.router.navigate(['/user-delete', userId]);
  }

  onBack(): void {
    this.router.navigate(['/admin-menu']);
  }

  nextPage(): void {
    this.currentPage++;
    this.loadUsers();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadUsers();
    }
  }
}
