import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService } from '../../services/authorization.service';
import { Authorization } from '../../models/authorization.model';

@Component({
  selector: 'app-authorization-detail',
  imports: [CommonModule],
  templateUrl: './authorization-detail.html',
  styleUrl: './authorization-detail.scss'
})
export class AuthorizationDetail implements OnInit {
  authorization: Authorization | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authorizationService: AuthorizationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['authorizationId']) {
        this.loadAuthorization(params['authorizationId']);
      }
    });
  }

  loadAuthorization(authorizationId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authorizationService.getAuthorization(authorizationId).subscribe({
      next: (authorization) => {
        this.isLoading = false;
        this.authorization = authorization;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Authorization Not Found';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/authorization-summary']);
  }
}
