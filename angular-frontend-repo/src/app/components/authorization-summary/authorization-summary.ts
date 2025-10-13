import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../services/authorization.service';
import { Authorization } from '../../models/authorization.model';

@Component({
  selector: 'app-authorization-summary',
  imports: [CommonModule],
  templateUrl: './authorization-summary.html',
  styleUrl: './authorization-summary.scss'
})
export class AuthorizationSummary implements OnInit {
  authorizations: Authorization[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authorizationService: AuthorizationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAuthorizations();
  }

  loadAuthorizations(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authorizationService.getAuthorizations().subscribe({
      next: (authorizations) => {
        this.isLoading = false;
        this.authorizations = authorizations;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load authorizations';
      }
    });
  }

  onViewDetail(authorization: Authorization): void {
    this.router.navigate(['/authorization-detail'], { 
      queryParams: { authorizationId: authorization.authorizationId }
    });
  }

  goBack(): void {
    this.router.navigate(['/main-menu']);
  }
}
