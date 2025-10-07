import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { MenuComponent } from './features/dashboard/menu/menu.component';
import { AdminMenuComponent } from './features/dashboard/admin-menu/admin-menu.component';
import { AccountListComponent } from './features/accounts/account-list/account-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
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
    path: 'cards',
    component: MenuComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'transactions',
    component: MenuComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'bill-payment',
    component: MenuComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reports',
    component: MenuComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/users',
    component: MenuComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
