import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [CreateAccountComponent],
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  exports: [CreateAccountComponent]
})
export class AccountModule { }
