import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { Signin } from './components/signin/signin';
import { MainMenu } from './components/main-menu/main-menu';
import { AdminMenu } from './components/admin-menu/admin-menu';
import { AccountList } from './components/account-list/account-list';
import { AccountView } from './components/account-view/account-view';
import { AccountAdd } from './components/account-add/account-add';
import { AccountUpdate } from './components/account-update/account-update';
import { CardList } from './components/card-list/card-list';
import { CardUpdate } from './components/card-update/card-update';
import { TransactionList } from './components/transaction-list/transaction-list';
import { TransactionDetail } from './components/transaction-detail/transaction-detail';
import { TransactionAdd } from './components/transaction-add/transaction-add';
import { UserList } from './components/user-list/user-list';
import { UserAdd } from './components/user-add/user-add';
import { UserUpdate } from './components/user-update/user-update';
import { UserDelete } from './components/user-delete/user-delete';
import { AuthorizationSummary } from './components/authorization-summary/authorization-summary';
import { AuthorizationDetail } from './components/authorization-detail/authorization-detail';
import { BillPayment } from './components/bill-payment/bill-payment';
import { ReportGeneration } from './components/report-generation/report-generation';
import { TransactionTypeList } from './components/transaction-type-list/transaction-type-list';
import { TransactionTypeUpdate } from './components/transaction-type-update/transaction-type-update';

export const routes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: 'signin', component: Signin },
  { path: 'main-menu', component: MainMenu, canActivate: [authGuard] },
  { path: 'admin-menu', component: AdminMenu, canActivate: [adminGuard] },
  { path: 'account-list', component: AccountList, canActivate: [authGuard] },
  { path: 'account-view', component: AccountView, canActivate: [authGuard] },
  { path: 'account-add', component: AccountAdd, canActivate: [authGuard] },
  { path: 'account-update/:id', component: AccountUpdate, canActivate: [authGuard] },
  { path: 'card-list', component: CardList, canActivate: [authGuard] },
  { path: 'card-update/:cardNumber', component: CardUpdate, canActivate: [authGuard] },
  { path: 'transaction-list', component: TransactionList, canActivate: [authGuard] },
  { path: 'transaction-detail/:id', component: TransactionDetail, canActivate: [authGuard] },
  { path: 'transaction-add', component: TransactionAdd, canActivate: [authGuard] },
  { path: 'user-list', component: UserList, canActivate: [adminGuard] },
  { path: 'user-add', component: UserAdd, canActivate: [adminGuard] },
  { path: 'user-update/:userId', component: UserUpdate, canActivate: [adminGuard] },
  { path: 'user-delete/:userId', component: UserDelete, canActivate: [adminGuard] },
  { path: 'authorization-summary', component: AuthorizationSummary, canActivate: [adminGuard] },
  { path: 'authorization-detail/:id', component: AuthorizationDetail, canActivate: [adminGuard] },
  { path: 'bill-payment', component: BillPayment, canActivate: [authGuard] },
  { path: 'report-generation', component: ReportGeneration, canActivate: [authGuard] },
  { path: 'transaction-type-list', component: TransactionTypeList, canActivate: [adminGuard] },
  { path: 'transaction-type-update/:typeCode', component: TransactionTypeUpdate, canActivate: [adminGuard] },
  { path: '**', redirectTo: '/signin' }
];
