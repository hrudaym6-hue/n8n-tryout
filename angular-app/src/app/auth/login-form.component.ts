import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMsg = '';
  failedAttempts = 0;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMsg = '';
    // Simulate login validation (can be replaced with service/api)
    if (this.loginForm.valid) {
      if (
        this.loginForm.value.username === 'user' &&
        this.loginForm.value.password === 'pass'
      ) {
        // Successful login, redirect (simulated)
        window.location.href = '/account/details';
        this.failedAttempts = 0;
      } else {
        this.failedAttempts++;
        if (this.failedAttempts >= 3) {
          this.errorMsg = 'Account locked after 3 failed attempts.';
        } else {
          this.errorMsg = 'Invalid username or password.';
        }
      }
    }
  }

  get f() { return this.loginForm.controls; }
}

