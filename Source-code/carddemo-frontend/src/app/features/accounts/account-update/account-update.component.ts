import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../core/services/account.service';
import { Account } from '../../../core/models/account.model';

@Component({
  selector: 'app-account-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-update.component.html',
  styleUrls: ['./account-update.component.css']
})
export class AccountUpdateComponent implements OnInit {
  updateForm!: FormGroup;
  account: Account | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.updateForm = this.formBuilder.group({
      accountId: [{value: '', disabled: true}],
      address: ['', [Validators.pattern(/^[a-zA-Z0-9\s]+$/)]],
      city: ['', [Validators.pattern(/^[a-zA-Z\s]+$/)]],
      state: ['', [Validators.pattern(/^[A-Z]{2}$/)]],
      zip: ['', [Validators.pattern(/^(\d{5}|\d{9})$/)]],
      phone: ['', [Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]],
      creditLimit: ['', [Validators.pattern(/^\d+(\.\d{2})?$/)]]
    });

    const accountId = this.route.snapshot.paramMap.get('id');
    if (accountId) {
      this.loadAccount(accountId);
    }
  }

  loadAccount(accountId: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.accountService.getAccountById(accountId).subscribe({
      next: (account) => {
        this.account = account;
        this.updateForm.patchValue({
          accountId: account.accountId,
          address: account.address,
          city: account.city,
          state: account.state,
          zip: account.zip,
          phone: account.phone,
          creditLimit: account.creditLimit
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load account';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.updateForm.invalid || !this.account) {
      this.errorMessage = 'Please fix all validation errors';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateData = this.updateForm.value;
    
    this.accountService.updateAccount(this.account.accountId, updateData).subscribe({
      next: () => {
        this.successMessage = 'Account updated successfully';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/accounts', this.account!.accountId]);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Failed to update account';
        this.isLoading = false;
      }
    });
  }

  clearForm(): void {
    if (this.account) {
      this.updateForm.patchValue({
        address: this.account.address,
        city: this.account.city,
        state: this.account.state,
        zip: this.account.zip,
        phone: this.account.phone,
        creditLimit: this.account.creditLimit
      });
    }
  }

  goBack(): void {
    if (this.account) {
      this.router.navigate(['/accounts', this.account.accountId]);
    } else {
      this.router.navigate(['/accounts']);
    }
  }
}
