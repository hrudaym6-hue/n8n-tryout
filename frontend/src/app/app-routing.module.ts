import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'users' },
  { path: 'users', loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule) },
  { path: 'accounts', loadChildren: () => import('./features/accounts/accounts.module').then(m => m.AccountsModule) },
  { path: 'transactions', loadChildren: () => import('./features/transactions/transactions.module').then(m => m.TransactionsModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
