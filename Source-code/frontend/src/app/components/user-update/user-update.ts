import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-update.html',
  styleUrl: './user-update.scss'
})
export class UserUpdate implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userForm!: FormGroup;
  userDetail: User | null = null;
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;
  isLoading = true;

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    if (userId) {
      this.loadUser(userId);
    }

    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(25)]],
      lastName: ['', [Validators.required, Validators.maxLength(25)]],
      password: ['', [Validators.required, Validators.maxLength(8)]],
      userType: ['', Validators.required]
    });
  }

  loadUser(userId: string): void {
    this.userService.getUser(userId).subscribe({
      next: (data) => {
        this.userDetail = data;
        this.userForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          userType: data.userType
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error loading user details.';
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid && this.userDetail) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const updateData: User = {
        ...this.userDetail,
        ...this.userForm.value
      };

      this.userService.updateUser(this.userDetail.userId, updateData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.successMessage = 'User updated successfully!';
          setTimeout(() => this.router.navigate(['/user-list']), 2000);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Error updating user. Please try again.';
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/user-list']);
  }
}
