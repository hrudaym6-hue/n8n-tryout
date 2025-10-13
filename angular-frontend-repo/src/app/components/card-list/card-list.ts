import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardService } from '../../services/card.service';
import { Card } from '../../models/card.model';
import { CustomValidators } from '../../shared/validators';

@Component({
  selector: 'app-card-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './card-list.html',
  styleUrl: './card-list.scss'
})
export class CardList implements OnInit {
  searchForm!: FormGroup;
  cards: Card[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cardService: CardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      accountId: ['', [Validators.required, CustomValidators.numeric(), CustomValidators.exactLength(11)]]
    });
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      this.markFormGroupTouched(this.searchForm);
      if (!this.searchForm.get('accountId')?.value) {
        this.errorMessage = 'Account ID is required';
      } else if (this.searchForm.get('accountId')?.hasError('exactLength')) {
        this.errorMessage = 'Account ID must be 11 digits long';
      }
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.cards = [];

    this.cardService.getCardsByAccount(this.searchForm.value.accountId).subscribe({
      next: (cards) => {
        this.isLoading = false;
        this.cards = cards;
        if (cards.length === 0) {
          this.errorMessage = 'No cards found for this account';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to retrieve cards';
      }
    });
  }

  onUpdate(card: Card): void {
    this.router.navigate(['/card-update'], { 
      queryParams: { cardNumber: card.cardNumber }
    });
  }

  onClear(): void {
    this.searchForm.reset();
    this.cards = [];
    this.errorMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/main-menu']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
