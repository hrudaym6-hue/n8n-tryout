import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthorizationService } from '../../services/authorization.service';
import { AuthorizationSummary as AuthorizationSummaryModel } from '../../models/authorization.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-authorization-summary',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './authorization-summary.html',
  styleUrl: './authorization-summary.scss'
})
export class AuthorizationSummary implements OnInit {
  private fb = inject(FormBuilder);
  private authorizationService = inject(AuthorizationService);
  private authService = inject(AuthService);
  private router = inject(Router);

  searchForm!: FormGroup;
  authorizations: AuthorizationSummaryModel[] = [];
  errorMessage = '';
  isLoading = false;
  currentPage = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      accountId: ['']
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadAuthorizations();
  }

  loadAuthorizations(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const accountId = this.searchForm.get('accountId')?.value;

    if (!accountId) {
      this.errorMessage = 'Please enter an Account ID';
      this.isLoading = false;
      return;
    }

    this.authorizationService.getAuthorizationsByAccount(accountId, this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.authorizations = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error retrieving authorizations. Please try again.';
        this.authorizations = [];
      }
    });
  }

  viewAuthorization(authorizationId: string): void {
    this.router.navigate(['/authorization-detail', authorizationId]);
  }

  onBack(): void {
    this.router.navigate(['/admin-menu']);
  }

  nextPage(): void {
    this.currentPage++;
    this.loadAuthorizations();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAuthorizations();
    }
  }
}
