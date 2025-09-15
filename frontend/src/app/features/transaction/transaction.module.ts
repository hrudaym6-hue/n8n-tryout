import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [CreateTransactionComponent],
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  exports: [CreateTransactionComponent]
})
export class TransactionModule { }
