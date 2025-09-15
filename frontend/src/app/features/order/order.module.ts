import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateOrderComponent } from './create-order/create-order.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [CreateOrderComponent],
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  exports: [CreateOrderComponent]
})
export class OrderModule { }
