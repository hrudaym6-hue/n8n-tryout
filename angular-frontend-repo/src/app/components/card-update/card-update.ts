import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CardService } from '../../services/card.service';
import { Card } from '../../models/card.model';
import { CustomValidators } from '../../shared/validators';

@Component({
  selector: 'app-card-update',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './card-update.html',
  styleUrl: './card-update.scss'
})
export class CardUpdate implements OnInit {
  searchForm!: FormGroup;
  updateForm!: FormGroup;
  card: Card | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  isUpdating: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cardService: CardService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      cardNumber: ['', [Validators.required, CustomValidators.numeric(), CustomValidators.exactLength(16)]]
    });

    this.updateForm = this.fb.group({
      cardStatus: ['', [Validators.required]],
      expirationDate: ['', [Validators.required, CustomValidators.dateFormat()]]
    });

    this.route.queryParams.subscribe(params => {
      if (params['cardNumber']) {
        this.searchForm.patchValue({ cardNumber: params['cardNumber'] });
        this.onSearch();
      }
    });
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      this.markFormGroupTouched(this.searchForm);
      if (!this.searchForm.get('cardNumber')?.value) {
        this.errorMessage = 'Card Number is required';
      } else if (this.searchForm.get('cardNumber')?.hasError('exactLength')) {
        this.errorMessage = 'Card Number must be 16 digits long';
      }
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.cardService.getCard(this.searchForm.value.cardNumber).subscribe({
      next: (card) => {
        this.isLoading = false;
        this.card = card;
        this.updateForm.patchValue({
          cardStatus: card.cardStatus,
          expirationDate: card.expirationDate
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Card Not Found';
      }
    });
  }

  onUpdate(): void {
    if (this.updateForm.invalid) {
      this.markFormGroupTouched(this.updateForm);
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    if (!this.card) {
      this.errorMessage = 'No card loaded';
      return;
    }

    this.isUpdating = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateRequest = {
      cardNumber: this.card.cardNumber,
      ...this.updateForm.value
    };

    this.cardService.updateCard(updateRequest).subscribe({
      next: (card) => {
        this.isUpdating = false;
        this.card = card;
        this.successMessage = 'Card updated successfully';
      },
      error: (error) => {
        this.isUpdating = false;
        this.errorMessage = error.error?.message || 'Failed to update card';
      }
    });
  }

  onClear(): void {
    this.searchForm.reset();
    this.updateForm.reset();
    this.card = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/card-list']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
