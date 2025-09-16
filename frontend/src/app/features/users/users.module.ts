import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: 'add', component: UserFormComponent },
  { path: ':id', component: UserDetailComponent },
  { path: ':id/edit', component: UserFormComponent }
];

@NgModule({
  declarations: [
    UserListComponent,
    UserFormComponent,
    UserDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class UsersModule { }
