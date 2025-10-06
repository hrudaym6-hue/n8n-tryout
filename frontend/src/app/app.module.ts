import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './features/user/user.module';
import { AccountModule } from './features/account/account.module';
import { OrderModule } from './features/order/order.module';
import { TransactionModule } from './features/transaction/transaction.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    UserModule,
    AccountModule,
    OrderModule,
    TransactionModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
