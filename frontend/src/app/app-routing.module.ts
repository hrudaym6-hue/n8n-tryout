import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './features/user/register/register.component';
import { LoginComponent } from './features/user/login/login.component';
import { CreateAccountComponent } from './features/account/create-account/create-account.component';
import { CreateOrderComponent } from './features/order/create-order/create-order.component';
import { CreateTransactionComponent } from './features/transaction/create-transaction/create-transaction.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'account', component: CreateAccountComponent },
  { path: 'order', component: CreateOrderComponent },
  { path: 'transaction', component: CreateTransactionComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
