import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardService } from '../../services/card.service';
import { CardListItem } from '../../models/card.model';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './card-list.html',
  styleUrl: './card-list.scss'
})
export class CardList implements OnInit {
  private fb = inject(FormBuilder);
  private cardService = inject(CardService);
  private router = inject(Router);

  searchForm!: FormGroup;
  cards: CardListItem[] = [];
  errorMessage = '';
  isLoading = false;
  currentPage = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      accountId: ['', [Validators.required, Validators.maxLength(11)]]
    });
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      this.loadCards();
    } else {
      this.errorMessage = 'Please enter a valid Account ID';
    }
  }

  loadCards(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const accountId = this.searchForm.get('accountId')?.value;

    this.cardService.getCardsByAccount(accountId, this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.cards = data;
        this.isLoading = false;
        if (data.length === 0) {
          this.errorMessage = 'No cards found for this account.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error retrieving cards. Please try again.';
        this.cards = [];
      }
    });
  }

  viewCard(cardNumber: string): void {
    this.router.navigate(['/card-update', cardNumber]);
  }

  onBack(): void {
    this.router.navigate(['/main-menu']);
  }

  nextPage(): void {
    this.currentPage++;
    this.loadCards();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadCards();
    }
  }
}
