import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { CustomValidators } from '../../shared/validators';

@Component({
  selector: 'app-user-update',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-update.html',
  styleUrl: './user-update.scss'
})
export class UserUpdate implements OnInit {
  searchForm!: FormGroup;
  updateForm!: FormGroup;
  user: User | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  isUpdating: boolean = false;

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

    this.updateForm = this.fb.group({
      firstName: ['', [Validators.required, CustomValidators.alphanumeric()]],
      lastName: ['', [Validators.required, CustomValidators.alphanumeric()]],
      password: [''],
      userType: ['', [Validators.required]]
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
        this.updateForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'User Not Found';
      }
    });
  }

  onUpdate(): void {
    if (this.updateForm.invalid) {
      this.markFormGroupTouched(this.updateForm);
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    if (!this.user) {
      this.errorMessage = 'No user loaded';
      return;
    }

    this.isUpdating = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.updateUser(this.user.userId, this.updateForm.value).subscribe({
      next: (user) => {
        this.isUpdating = false;
        this.user = user;
        this.successMessage = 'User updated successfully';
      },
      error: (error) => {
        this.isUpdating = false;
        this.errorMessage = error.error?.message || 'Failed to update user';
      }
    });
  }

  onClear(): void {
    this.searchForm.reset();
    this.updateForm.reset();
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
