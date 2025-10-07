import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signin.html',
  styleUrl: './signin.scss'
})
export class Signin implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  signinForm!: FormGroup;
  errorMessage = '';
  isSubmitting = false;

  ngOnInit(): void {
    this.signinForm = this.fb.group({
      userId: ['', [Validators.required, Validators.maxLength(8)]],
      password: ['', [Validators.required, Validators.maxLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.signinForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      this.authService.login(this.signinForm.value).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.user.userType === 'A') {
            this.router.navigate(['/admin-menu']);
          } else {
            this.router.navigate(['/main-menu']);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Invalid User ID or Password. Please try again.';
        }
      });
    } else {
      if (this.signinForm.get('userId')?.hasError('required')) {
        this.errorMessage = 'User ID is required';
      } else if (this.signinForm.get('password')?.hasError('required')) {
        this.errorMessage = 'Password is required';
      }
    }
  }

  onClear(): void {
    this.signinForm.reset();
    this.errorMessage = '';
  }
}
