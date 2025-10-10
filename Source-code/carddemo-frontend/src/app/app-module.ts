import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
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

@NgModule({
  declarations: [
    App,
    LoginComponent,
    RegisterComponent,
    MenuComponent,
    AdminMenuComponent,
    AccountListComponent,
    UserListComponent,
    UserAddComponent,
    UserUpdateComponent,
    UserDeleteComponent,
    CardListComponent,
    TransactionListComponent,
    BillPaymentComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [App]
})
export class AppModule { }
