import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountDetailsViewComponent } from './account/account-details-view.component';
import { AccountEditFormComponent } from './account/account-edit-form.component';
import { LoginFormComponent } from './auth/login-form.component';
import { TransactionListComponent } from './transaction/transaction-list.component';
import { TransferFormComponent } from './transaction/transfer-form.component';
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginFormComponent },
  { path: 'account/details', component: AccountDetailsViewComponent },
  { path: 'account/edit', component: AccountEditFormComponent },
  { path: 'transaction/history', component: TransactionListComponent },
  { path: 'transaction/transfer', component: TransferFormComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
