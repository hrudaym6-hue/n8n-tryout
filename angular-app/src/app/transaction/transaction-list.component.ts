import { Component } from '@angular/core';

@Component({
  selector: 'transaction-list',
  templateUrl: './transaction-list.component.html'
})
export class TransactionListComponent {
  transactions = [
    { date: '2024-01-02', description: 'Coffee Shop', amount: -3.5 },
    { date: '2024-01-01', description: 'ATM Deposit', amount: 100 },
    { date: '2023-12-28', description: 'Supermarket', amount: -45 }
  ];
}

