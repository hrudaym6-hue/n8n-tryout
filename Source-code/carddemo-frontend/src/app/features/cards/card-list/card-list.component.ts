import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardService } from '../../../core/services/card.service';
import { AuthService } from '../../../core/services/auth.service';
import { Card } from '../../../core/models/card.model';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent implements OnInit {
  cards: Card[] = [];
  isLoading = false;
  errorMessage = '';
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;

  constructor(
    private cardService: CardService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.cardService.getCards().subscribe({
      next: (cards) => {
        this.cards = cards;
        this.totalPages = Math.ceil(cards.length / this.pageSize);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load cards';
        this.isLoading = false;
      }
    });
  }

  get paginatedCards(): Card[] {
    const start = this.currentPage * this.pageSize;
    return this.cards.slice(start, start + this.pageSize);
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

  selectCard(cardNumber: string): void {
    if (this.authService.isAdmin) {
      this.router.navigate(['/cards', cardNumber, 'update']);
    } else {
      this.router.navigate(['/cards/search'], { queryParams: { cardNumber } });
    }
  }

  searchCards(): void {
    this.router.navigate(['/cards/search']);
  }

  goBack(): void {
    if (this.authService.isAdmin) {
      this.router.navigate(['/admin-menu']);
    } else {
      this.router.navigate(['/menu']);
    }
  }
}
