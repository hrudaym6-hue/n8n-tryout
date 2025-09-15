import { Routes } from '@angular/router';
import { LoginComponent } from './features/user/login/login.component';
import { RegisterComponent } from './features/user/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CreateAccountComponent } from './features/account/create-account/create-account.component';
import { CreateTransactionComponent } from './features/transaction/create-transaction/create-transaction.component';
import { CreateOrderComponent } from './features/order/create-order/create-order.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'transaction', component: CreateTransactionComponent },
  { path: 'order', component: CreateOrderComponent },
  { path: '**', redirectTo: '/login' }
];
