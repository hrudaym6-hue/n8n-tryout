import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthorizationService } from '../../services/authorization.service';
import { AuthorizationDetail as AuthorizationDetailModel } from '../../models/authorization.model';

@Component({
  selector: 'app-authorization-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './authorization-detail.html',
  styleUrl: './authorization-detail.scss'
})
export class AuthorizationDetail implements OnInit {
  private authorizationService = inject(AuthorizationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  authorizationDetail: AuthorizationDetailModel | null = null;
  errorMessage = '';
  successMessage = '';
  isLoading = true;
  isUpdating = false;

  ngOnInit(): void {
    const authorizationId = this.route.snapshot.paramMap.get('id');
    if (authorizationId) {
      this.loadAuthorization(authorizationId);
    }
  }

  loadAuthorization(authorizationId: string): void {
    this.authorizationService.getAuthorization(authorizationId).subscribe({
      next: (data) => {
        this.authorizationDetail = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error loading authorization details.';
      }
    });
  }

  toggleFraudFlag(): void {
    if (this.authorizationDetail) {
      this.isUpdating = true;
      this.errorMessage = '';
      this.successMessage = '';

      const newFraudFlag: 'Y' | 'N' = this.authorizationDetail.fraudFlag === 'Y' ? 'N' : 'Y';

      this.authorizationService.updateFraudFlag(this.authorizationDetail.authorizationId, newFraudFlag).subscribe({
        next: () => {
          this.isUpdating = false;
          if (this.authorizationDetail) {
            this.authorizationDetail.fraudFlag = newFraudFlag;
          }
          this.successMessage = 'Fraud flag updated successfully!';
        },
        error: (error) => {
          this.isUpdating = false;
          this.errorMessage = error.error?.message || 'Error updating fraud flag. Please try again.';
        }
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/authorization-summary']);
  }
}
