import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {
  form: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      user_id: ['', Validators.required],
      account_number: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]]
    });
  }

  async submit() {
    if (this.form.invalid) return;
    
    this.loading = true;
    this.error = null;
    this.success = null;
    
    try {
      console.log('Making direct fetch request to create account...');
      const response = await fetch(`${environment.apiUrl}/api/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.form.value)
      });
      
      console.log('Account creation response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Account creation success:', data);
      
      this.success = 'Account created successfully!';
      this.form.reset();
      
    } catch (error) {
      console.error('Account creation error:', error);
      this.error = 'Account creation failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
