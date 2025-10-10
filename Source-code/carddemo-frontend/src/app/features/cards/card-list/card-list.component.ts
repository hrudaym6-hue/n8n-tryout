import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardService, Card, CardListResponse } from '../../../core/services/card.service';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css'],
  standalone: false
})
export class CardListComponent implements OnInit {
  cards: Card[] = [];
  loading = false;
  errorMessage = '';
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  searchCardNumber = '';
  searchAccountId = '';

  constructor(
    private cardService: CardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.cardService.getCards(
      this.currentPage, 
      this.pageSize, 
      this.searchAccountId || undefined,
      this.searchCardNumber || undefined
    ).subscribe({
      next: (response: CardListResponse) => {
        this.cards = response.cards;
        this.totalRecords = response.total;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load cards. Please try again.';
        console.error('Error loading cards:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadCards();
  }

  onClearSearch(): void {
    this.searchCardNumber = '';
    this.searchAccountId = '';
    this.currentPage = 1;
    this.loadCards();
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCards();
    }
  }

  onNextPage(): void {
    const totalPages = Math.ceil(this.totalRecords / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.loadCards();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  onBackToMenu(): void {
    this.router.navigate(['/menu']);
  }

  formatCurrency(amount: number | undefined): string {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
