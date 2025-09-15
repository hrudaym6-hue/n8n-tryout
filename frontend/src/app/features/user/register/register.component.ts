import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/api.service';
import { passwordValidator } from '../validators/password.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
      user_id: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, passwordValidator]],
      loyalty_level: ['BRONZE']
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
