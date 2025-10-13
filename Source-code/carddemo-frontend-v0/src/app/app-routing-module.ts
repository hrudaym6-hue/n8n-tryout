import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { MenuComponent } from './features/dashboard/menu/menu.component';
import { AdminMenuComponent } from './features/dashboard/admin-menu/admin-menu.component';
import { AccountListComponent } from './features/accounts/account-list/account-list.component';
import { UserListComponent } from './features/users/user-list/user-list.component';
import { UserAddComponent } from './features/users/user-add/user-add.component';
import { UserUpdateComponent } from './features/users/user-update/user-update.component';
import { UserDeleteComponent } from './features/users/user-delete/user-delete.component';
import { CardListComponent } from './features/cards/card-list/card-list.component';
import { TransactionListComponent } from './features/transactions/transaction-list/transaction-list.component';
import { BillPaymentComponent } from './features/bill-payment/bill-payment.component';
import { ReportsComponent } from './features/reports/reports.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: MenuComponent, 
    canActivate: [AuthGuard] 
  },
  {
    path: 'admin/menu',
    component: AdminMenuComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'accounts',
    component: AccountListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/users',
    component: UserListComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/users/add',
    component: UserAddComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/users/update',
    component: UserUpdateComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/users/delete',
    component: UserDeleteComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'cards',
    component: CardListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'bill-payment',
    component: BillPaymentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'transactions',
    component: TransactionListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
