import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountDetailsViewComponent } from './account/account-details-view.component';
import { AccountEditFormComponent } from './account/account-edit-form.component';
import { LoginFormComponent } from './auth/login-form.component';
import { TransactionListComponent } from './transaction/transaction-list.component';
import { TransferFormComponent } from './transaction/transfer-form.component';
@NgModule({
  declarations: [
    AppComponent,
    AccountDetailsViewComponent,
    AccountEditFormComponent,
    LoginFormComponent,
    TransactionListComponent,
    TransferFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
