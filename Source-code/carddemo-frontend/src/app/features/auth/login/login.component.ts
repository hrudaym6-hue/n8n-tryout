import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userId: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      if (!this.f['userId'].value) {
        this.errorMessage = 'User ID is required';
      } else if (!this.f['password'].value) {
        this.errorMessage = 'Password is required';
      }
      return;
    }

    this.loading = true;
    this.authService.login(this.f['userId'].value, this.f['password'].value)
      .subscribe({
        next: (response) => {
          if (response.user.userType === 'A') {
            this.router.navigate(['/admin/menu']);
          } else {
            this.router.navigate([this.returnUrl]);
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Invalid User ID or Password';
          this.loading = false;
        }
      });
  }

  onClear(): void {
    this.loginForm.reset();
    this.submitted = false;
    this.errorMessage = '';
  }
}
