import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardService } from '../../../core/services/card.service';
import { Card } from '../../../core/models/card.model';

@Component({
  selector: 'app-card-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './card-update.component.html',
  styleUrls: ['./card-update.component.css']
})
export class CardUpdateComponent implements OnInit {
  updateForm!: FormGroup;
  card: Card | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cardService: CardService
  ) {}

  ngOnInit(): void {
    this.updateForm = this.formBuilder.group({
      cardNumber: [{value: '', disabled: true}],
      accountId: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      cardHolderName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]+$/)]],
      expiryMonth: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)]],
      expiryYear: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      status: ['', [Validators.required, Validators.pattern(/^[YN]$/)]]
    });

    const cardNumber = this.route.snapshot.paramMap.get('id');
    if (cardNumber) {
      this.loadCard(cardNumber);
    }
  }

  loadCard(cardNumber: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.cardService.getCardByNumber(cardNumber).subscribe({
      next: (card) => {
        this.card = card;
        this.updateForm.patchValue({
          cardNumber: card.cardNumber,
          accountId: card.accountId,
          cardHolderName: card.cardHolderName,
          expiryMonth: card.expiryMonth,
          expiryYear: card.expiryYear,
          status: card.status
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load card';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.updateForm.invalid || !this.card) {
      this.errorMessage = 'Please fix all validation errors';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateData = this.updateForm.value;
    
    this.cardService.updateCard(this.card.cardNumber, updateData).subscribe({
      next: () => {
        this.successMessage = 'Card updated successfully';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/cards']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Failed to update card';
        this.isLoading = false;
      }
    });
  }

  clearForm(): void {
    if (this.card) {
      this.updateForm.patchValue({
        accountId: this.card.accountId,
        cardHolderName: this.card.cardHolderName,
        expiryMonth: this.card.expiryMonth,
        expiryYear: this.card.expiryYear,
        status: this.card.status
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/cards']);
  }
}
