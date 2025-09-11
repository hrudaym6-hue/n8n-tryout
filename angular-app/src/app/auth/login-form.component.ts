import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-login-form',
  template: `
    <h2>Login</h2>
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <label>Username:</label>
      <input formControlName="username"/>
      <div *ngIf="loginForm.controls['username'].invalid && loginForm.controls['username'].touched" class="error">Username is required.</div>
      <br>
      <label>Password:</label>
      <input formControlName="password" type="password"/>
      <div *ngIf="loginForm.controls['password'].invalid && loginForm.controls['password'].touched" class="error">Password is required.</div>
      <br>
      <button type="submit" [disabled]="loginForm.invalid || locked">Login</button>
    </form>
    <div *ngIf="invalid" class="error">Invalid credentials</div>
    <div *ngIf="locked" class="error">Account locked after 3 failed attempts.</div>
  `,
  styles: [`.error { color: red; }`]
})
export class LoginFormComponent {
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  invalid = false;
  locked = false;
  attempts = 0;
  constructor(private fb: FormBuilder) {}
  onSubmit() {
    this.attempts++;
    if (this.loginForm.value.username === 'user' && this.loginForm.value.password === 'pass') {
      // Simulate login, redirect
      location.href = '#/account/details';
    } else {
      this.invalid = true;
      if (this.attempts >= 3) {
        this.locked = true;
      }
    }
  }
}
