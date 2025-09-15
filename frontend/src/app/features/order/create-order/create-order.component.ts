import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent {
  form: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      user_id: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      backordered: [false]
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    this.api.post<any>('/api/orders', this.form.value).subscribe({
      next: () => {
        this.success = 'Order created!';
        this.form.reset();
      },
      error: err => {
        this.error = err.error?.message || 'Order creation failed';
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}
