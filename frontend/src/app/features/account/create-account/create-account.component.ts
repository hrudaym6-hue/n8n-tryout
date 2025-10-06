import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {
  form: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      user_id: ['', Validators.required],
      account_number: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]]
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    this.api.post<any>('/api/accounts', this.form.value).subscribe({
      next: () => {
        this.success = 'Account created!';
        this.form.reset();
      },
      error: err => {
        this.error = err.error?.message || 'Account creation failed';
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}
