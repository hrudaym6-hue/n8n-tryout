import { Component } from '@angular/core';
@Component({
  selector: 'app-transaction-list',
  template: `
    <h2>Transaction History</h2>
    <ul>
      <li *ngFor="let tx of transactions">
        <span>{{tx.date}} - {{tx.type}} - {{tx.amount | currency}}</span>
      </li>
    </ul>
    <div *ngIf="!transactions.length" class="error">No transactions found.</div>
  `,
  styles: [`.error {color: red;}`]
})
export class TransactionListComponent {
  transactions = [
    {date: '2024-06-10', type: 'Debit', amount: -50.2},
    {date: '2024-06-08', type: 'Credit', amount: 200.0}
  ]; // Simulated data
}
