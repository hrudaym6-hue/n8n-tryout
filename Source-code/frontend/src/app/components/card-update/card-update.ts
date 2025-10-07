import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardService } from '../../services/card.service';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-card-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './card-update.html',
  styleUrl: './card-update.scss'
})
export class CardUpdate implements OnInit {
  private fb = inject(FormBuilder);
  private cardService = inject(CardService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  cardForm!: FormGroup;
  cardDetail: Card | null = null;
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;
  isLoading = true;

  ngOnInit(): void {
    const cardNumber = this.route.snapshot.paramMap.get('cardNumber');
    if (cardNumber) {
      this.loadCard(cardNumber);
    }

    this.cardForm = this.fb.group({
      cardStatus: ['', Validators.required],
      expirationDate: ['', Validators.required]
    });
  }

  loadCard(cardNumber: string): void {
    this.cardService.getCard(cardNumber).subscribe({
      next: (data) => {
        this.cardDetail = data;
        this.cardForm.patchValue({
          cardStatus: data.cardStatus,
          expirationDate: data.expirationDate
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error loading card details.';
      }
    });
  }

  onSubmit(): void {
    if (this.cardForm.valid && this.cardDetail) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const updateData = {
        ...this.cardDetail,
        cardStatus: this.cardForm.get('cardStatus')?.value,
        expirationDate: this.cardForm.get('expirationDate')?.value
      };

      this.cardService.updateCard(this.cardDetail.cardNumber, updateData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.successMessage = 'Card updated successfully!';
          setTimeout(() => this.router.navigate(['/card-list']), 2000);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Error updating card. Please try again.';
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/card-list']);
  }
}
