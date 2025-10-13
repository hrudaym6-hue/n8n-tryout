import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardService } from '../../../core/services/card.service';
import { Card } from '../../../core/models/card.model';

@Component({
  selector: 'app-card-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './card-search.component.html',
  styleUrls: ['./card-search.component.css']
})
export class CardSearchComponent implements OnInit {
  searchForm!: FormGroup;
  card: Card | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private cardService: CardService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]]
    });

    const cardNumber = this.route.snapshot.queryParamMap.get('cardNumber');
    if (cardNumber) {
      this.searchForm.patchValue({ cardNumber });
      this.onSearch();
    }
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      this.errorMessage = 'Please enter a valid 16-digit card number';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.card = null;

    const cardNumber = this.searchForm.value.cardNumber;

    this.cardService.searchCard(cardNumber).subscribe({
      next: (card) => {
        this.card = card;
        this.isLoading = false;
      },
      error: (error) => {
        if (error.status === 404) {
          this.errorMessage = 'Card not found';
        } else {
          this.errorMessage = 'Failed to search card';
        }
        this.isLoading = false;
      }
    });
  }

  clearForm(): void {
    this.searchForm.reset();
    this.card = null;
    this.errorMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/cards']);
  }

  get cardNumber() {
    return this.searchForm.get('cardNumber');
  }
}
