import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-transfer-form',
  template: `
    <h2>Transfer Money</h2>
    <form [formGroup]="transferForm" (ngSubmit)="onSubmit()">
      <label>Recipient Account:</label>
      <input formControlName="recipient"/>
      <div *ngIf="transferForm.controls['recipient'].invalid && transferForm.controls['recipient'].touched" class="error">Recipient is required.</div>
      <br>
      <label>Amount:</label>
      <input formControlName="amount" type="number"/>
      <div *ngIf="transferForm.controls['amount'].invalid && transferForm.controls['amount'].touched" class="error">Amount must be greater than 0.</div>
      <br>
      <button type="submit" [disabled]="transferForm.invalid">Transfer</button>
    </form>
    <div *ngIf="submitted && transferForm.valid && !insufficientFunds" class="confirm">Transfer successful!</div>
    <div *ngIf="insufficientFunds" class="error">Insufficient funds.</div>
  `,
  styles: [`.error {color: red;} .confirm {color: green;}`]
})
export class TransferFormComponent {
  submitted = false;
  insufficientFunds = false;
  balance = 500; // Simulated balance
  transferForm = this.fb.group({
    recipient: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]]
  });
  constructor(private fb: FormBuilder) {}
  onSubmit() {
    this.submitted = true;
    const amount = this.transferForm.value.amount;
    if (amount > this.balance) {
      this.insufficientFunds = true;
    } else {
      this.insufficientFunds = false;
      // Simulate transfer
    }
  }
}
