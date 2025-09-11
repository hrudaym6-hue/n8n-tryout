import { Component } from '@angular/core';
@Component({
  selector: 'app-account-details-view',
  template: `
    <h2>Account Details</h2>
    <div *ngIf="accountExists; else noAccount">
      <p><strong>Name:</strong> {{user.name}}</p>
      <p><strong>Number:</strong> {{user.number}}</p>
      <p><strong>Type:</strong> {{user.type}}</p>
      <p><strong>Balance:</strong> {{user.balance | currency}}</p>
    </div>
    <ng-template #noAccount>
      <div class="error">Account does not exist.</div>
    </ng-template>
  `,
  styles: [`.error { color: red; }`]
})
export class AccountDetailsViewComponent {
  accountExists = true; // Simulate account
  user = {
    name: 'John Doe', number: '123456', type: 'Savings', balance: 4325.18
  };
}
