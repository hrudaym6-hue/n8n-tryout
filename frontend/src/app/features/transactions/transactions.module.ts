import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionFormComponent } from './transaction-form/transaction-form.component';

const routes: Routes = [
  { path: '', component: TransactionListComponent },
  { path: 'add', component: TransactionFormComponent }
];

@NgModule({
  declarations: [
    TransactionListComponent,
    TransactionFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class TransactionsModule { }
