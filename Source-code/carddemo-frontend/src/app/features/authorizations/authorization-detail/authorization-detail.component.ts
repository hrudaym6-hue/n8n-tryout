import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { Authorization } from '../../../core/models/authorization.model';

@Component({
  selector: 'app-authorization-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './authorization-detail.component.html',
  styleUrls: ['./authorization-detail.component.css']
})
export class AuthorizationDetailComponent implements OnInit {
  authorization: Authorization | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authorizationService: AuthorizationService
  ) {}

  ngOnInit(): void {
    const authId = this.route.snapshot.paramMap.get('id');
    if (authId) {
      this.loadAuthorization(authId);
    }
  }

  loadAuthorization(authId: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authorizationService.getAuthorizationById(authId).subscribe({
      next: (authorization) => {
        this.authorization = authorization;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.status === 404 ? 'Authorization not found' : 'Failed to load authorization';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/authorizations']);
  }
}
