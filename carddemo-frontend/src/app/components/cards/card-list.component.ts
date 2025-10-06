import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CardService } from '../../services/card.service';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css'
})
export class CardListComponent implements OnInit {
  cards = signal<Card[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  searchAccountId = signal<string>('');
  searchCardNumber = signal<string>('');
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalRecords = signal<number>(0);
  pageSize = 10;

  constructor(
    private cardService: CardService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['accountId']) {
        this.searchAccountId.set(params['accountId']);
      }
      this.loadCards();
    });
  }

  loadCards(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const accountId = this.searchAccountId() || undefined;
    const cardNumber = this.searchCardNumber() || undefined;

    this.cardService.getCards(this.currentPage(), this.pageSize, accountId, cardNumber).subscribe({
      next: (response) => {
        this.cards.set(response.cards);
        this.totalRecords.set(response.total);
        this.totalPages.set(Math.ceil(response.total / this.pageSize));
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load cards');
        this.isLoading.set(false);
      }
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadCards();
  }

  onClearSearch(): void {
    this.searchAccountId.set('');
    this.searchCardNumber.set('');
    this.currentPage.set(1);
    this.loadCards();
  }

  viewCard(cardNumber: string): void {
    this.router.navigate(['/cards', cardNumber]);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadCards();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadCards();
    }
  }

  getStatusLabel(status: string): string {
    return status === 'Y' ? 'Active' : 'Inactive';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  maskCardNumber(cardNumber: string): string {
    if (cardNumber.length <= 4) return cardNumber;
    return '**** **** **** ' + cardNumber.slice(-4);
  }
}
