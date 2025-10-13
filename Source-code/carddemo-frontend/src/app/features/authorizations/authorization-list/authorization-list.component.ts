import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { AuthService } from '../../../core/services/auth.service';
import { Authorization } from '../../../core/models/authorization.model';

@Component({
  selector: 'app-authorization-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './authorization-list.component.html',
  styleUrls: ['./authorization-list.component.css']
})
export class AuthorizationListComponent implements OnInit {
  authorizations: Authorization[] = [];
  isLoading = false;
  errorMessage = '';
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;

  constructor(
    private authorizationService: AuthorizationService,
    private authService: AuthService,
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
        this.authorizations = authorizations;
        this.totalPages = Math.ceil(authorizations.length / this.pageSize);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load authorizations';
        this.isLoading = false;
      }
    });
  }

  get paginatedAuthorizations(): Authorization[] {
    const start = this.currentPage * this.pageSize;
    return this.authorizations.slice(start, start + this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  viewDetails(authId: string): void {
    this.router.navigate(['/authorizations', authId]);
  }

  goBack(): void {
    if (this.authService.isAdmin) {
      this.router.navigate(['/admin-menu']);
    } else {
      this.router.navigate(['/menu']);
    }
  }
}
