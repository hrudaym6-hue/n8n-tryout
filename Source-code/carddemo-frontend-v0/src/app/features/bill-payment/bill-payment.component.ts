import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bill-payment',
  templateUrl: './bill-payment.component.html',
  styleUrls: ['./bill-payment.component.css'],
  standalone: false
})
export class BillPaymentComponent {
  constructor(private router: Router) {}

  onBackToMenu(): void {
    this.router.navigate(['/menu']);
  }
}
