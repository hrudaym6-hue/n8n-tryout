import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      userId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      if (!this.f['userId'].value) {
        this.errorMessage = 'User ID is required';
      } else if (!this.f['firstName'].value) {
        this.errorMessage = 'First name is required';
      } else if (!this.f['lastName'].value) {
        this.errorMessage = 'Last name is required';
      } else if (!this.f['password'].value) {
        this.errorMessage = 'Password is required';
      } else if (this.f['password'].value.length < 6) {
        this.errorMessage = 'Password must be at least 6 characters';
      } else if (!this.f['confirmPassword'].value) {
        this.errorMessage = 'Please confirm your password';
      }
      return;
    }

    if (this.f['password'].value !== this.f['confirmPassword'].value) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.authService.register(
      this.f['userId'].value,
      this.f['firstName'].value,
      this.f['lastName'].value,
      this.f['password'].value
    ).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Registration failed';
        this.loading = false;
      }
    });
  }

  onClear(): void {
    this.registerForm.reset();
    this.submitted = false;
    this.errorMessage = '';
  }
}
