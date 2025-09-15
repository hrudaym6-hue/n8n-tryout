import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/api.service';
import { AuthService } from '../../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    this.api.post<any>('/api/users/login', this.form.value).subscribe({
      next: res => {
        this.auth.setToken(res.token);
        this.router.navigate(['/']);
      },
      error: err => {
        this.error = err.error?.message || 'Login failed';
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}
