import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      user_id: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async submit() {
    console.log('Submit method called');
    console.log('Form valid:', this.form.valid);
    console.log('Form value:', this.form.value);
    
    if (this.form.invalid) {
      console.log('Form is invalid, not submitting');
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    try {
      console.log('Making direct fetch request to login...');
      const response = await fetch(`${environment.apiUrl}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.form.value)
      });
      
      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Login success:', data);
      
      this.auth.setToken(data.token);
      this.router.navigate(['/dashboard']);
      
    } catch (error) {
      console.error('Login error:', error);
      this.error = 'Login failed. Please check your credentials.';
    } finally {
      this.loading = false;
    }
  }
}
