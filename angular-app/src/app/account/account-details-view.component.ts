import { Component } from '@angular/core';

@Component({
  selector: 'account-details-view',
  templateUrl: './account-details-view.component.html'
})
export class AccountDetailsViewComponent {
  user = { name: 'John Doe', number: '12345678', type: 'Savings', balance: 1000.00 };
  accountExists = true; // For demo; in reality, check actual data
}

