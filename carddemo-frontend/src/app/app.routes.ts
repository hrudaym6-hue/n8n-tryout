import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AccountListComponent } from './components/accounts/account-list.component';
import { AccountDetailComponent } from './components/accounts/account-detail.component';
import { CardListComponent } from './components/cards/card-list.component';
import { TransactionListComponent } from './components/transactions/transaction-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'accounts', component: AccountListComponent, canActivate: [authGuard] },
  { path: 'accounts/:id', component: AccountDetailComponent, canActivate: [authGuard] },
  { path: 'cards', component: CardListComponent, canActivate: [authGuard] },
  { path: 'transactions', component: TransactionListComponent, canActivate: [authGuard] },
  { path: 'authorizations', component: TransactionListComponent, canActivate: [authGuard] },
  { path: 'transaction-types', component: TransactionListComponent, canActivate: [authGuard, adminGuard] },
  { path: 'users', component: AccountListComponent, canActivate: [authGuard, adminGuard] },
  { path: '**', redirectTo: '/login' }
];
