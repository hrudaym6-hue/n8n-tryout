import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AccountListComponent } from './account-list/account-list.component';
import { AccountFormComponent } from './account-form/account-form.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';

const routes: Routes = [
  { path: '', component: AccountListComponent },
  { path: 'add', component: AccountFormComponent },
  { path: ':id', component: AccountDetailComponent },
  { path: ':id/edit', component: AccountFormComponent }
];

@NgModule({
  declarations: [
    AccountListComponent,
    AccountFormComponent,
    AccountDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AccountsModule { }
