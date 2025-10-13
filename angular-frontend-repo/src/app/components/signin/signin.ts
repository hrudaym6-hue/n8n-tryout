import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signin.html',
  styleUrl: './signin.scss'
})
export class Signin implements OnInit {
  signinForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signinForm = this.fb.group({
      userId: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.signinForm.invalid) {
      this.markFormGroupTouched(this.signinForm);
      if (!this.signinForm.get('userId')?.value) {
        this.errorMessage = 'Please enter User ID';
      } else if (!this.signinForm.get('password')?.value) {
        this.errorMessage = 'Please enter a Password';
      }
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.signinForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.user.userType === 'A') {
          this.router.navigate(['/admin-menu']);
        } else {
          this.router.navigate(['/main-menu']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Invalid User ID and/or Password';
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
