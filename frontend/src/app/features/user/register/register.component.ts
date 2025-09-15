import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/api.service';
import { passwordValidator } from '../validators/password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, passwordValidator]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    this.api.post<any>('/api/users', this.form.value).subscribe({
      next: () => {
        this.success = 'Registration successful! Please login.';
        this.form.reset();
      },
      error: err => {
        this.error = err.error?.message || 'Registration failed';
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}
