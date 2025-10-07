import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-add.html',
  styleUrl: './user-add.scss'
})
export class UserAdd implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  userForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;

  ngOnInit(): void {
    this.userForm = this.fb.group({
      userId: ['', [Validators.required, Validators.maxLength(8)]],
      firstName: ['', [Validators.required, Validators.maxLength(25)]],
      lastName: ['', [Validators.required, Validators.maxLength(25)]],
      password: ['', [Validators.required, Validators.maxLength(8)]],
      userType: ['R', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const user: User = this.userForm.value;

      this.userService.createUser(user).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.successMessage = 'User created successfully!';
          setTimeout(() => this.router.navigate(['/user-list']), 2000);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Error creating user. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly';
    }
  }

  onCancel(): void {
    this.router.navigate(['/user-list']);
  }
}
