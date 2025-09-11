import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-account-edit-form',
  template: `
    <h2>Update Contact Details</h2>
    <form [formGroup]="editForm" (ngSubmit)="onSubmit()">
      <label>Phone:</label>
      <input formControlName="phone"/>
      <div *ngIf="editForm.controls['phone'].invalid && editForm.controls['phone'].touched" class="error">Phone is required.</div>
      <br>
      <label>Email:</label>
      <input formControlName="email"/>
      <div *ngIf="editForm.controls['email'].invalid && editForm.controls['email'].touched" class="error">
        Valid email required.
      </div>
      <br>
      <button type="submit" [disabled]="editForm.invalid">Update</button>
    </form>
    <div *ngIf="submitted && editForm.valid" class="confirm">Contact details updated!</div>
    <div *ngIf="submitted && editForm.invalid" class="error">Please fill out required fields correctly.</div>
  `,
  styles: [`.error { color: red; } .confirm { color: green; }`]
})
export class AccountEditFormComponent {
  submitted = false;
  editForm = this.fb.group({
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  constructor(private fb: FormBuilder) {}
  onSubmit() {
    this.submitted = true;
    // Simulate DB update
  }
}
