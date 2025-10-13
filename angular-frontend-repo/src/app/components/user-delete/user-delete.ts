import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { CustomValidators } from '../../shared/validators';

@Component({
  selector: 'app-user-delete',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-delete.html',
  styleUrl: './user-delete.scss'
})
export class UserDelete implements OnInit {
  searchForm!: FormGroup;
  user: User | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  isDeleting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      userId: ['', [Validators.required, CustomValidators.alphanumeric()]]
    });

    this.route.queryParams.subscribe(params => {
      if (params['userId']) {
        this.searchForm.patchValue({ userId: params['userId'] });
        this.onSearch();
      }
    });
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      this.markFormGroupTouched(this.searchForm);
      this.errorMessage = 'User ID is required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.getUser(this.searchForm.value.userId).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.user = user;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'User Not Found';
      }
    });
  }

  onDelete(): void {
    if (!this.user) {
      this.errorMessage = 'No user loaded';
      return;
    }

    this.isDeleting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.deleteUser(this.user.userId).subscribe({
      next: () => {
        this.isDeleting = false;
        this.successMessage = 'User deleted successfully';
        setTimeout(() => {
          this.router.navigate(['/user-list']);
        }, 2000);
      },
      error: (error) => {
        this.isDeleting = false;
        this.errorMessage = error.error?.message || 'Failed to delete user';
      }
    });
  }

  onClear(): void {
    this.searchForm.reset();
    this.user = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/user-list']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
