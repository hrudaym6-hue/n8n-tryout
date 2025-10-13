import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userId: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { userId, password } = this.loginForm.value;

    this.authService.login(userId, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.user.userType === 'A') {
          this.router.navigate(['/admin-menu']);
        } else {
          this.router.navigate(['/menu']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 404) {
          this.errorMessage = 'User not found';
        } else if (error.status === 401) {
          this.errorMessage = 'Wrong Password';
        } else {
          this.errorMessage = 'An error occurred. Please try again.';
        }
      }
    });
  }

  get userId() {
    return this.loginForm.get('userId');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
