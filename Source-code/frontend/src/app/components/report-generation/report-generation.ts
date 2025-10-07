import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { ReportRequest, ReportResponse } from '../../models/report.model';

@Component({
  selector: 'app-report-generation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './report-generation.html',
  styleUrl: './report-generation.scss'
})
export class ReportGeneration implements OnInit {
  private fb = inject(FormBuilder);
  private reportService = inject(ReportService);
  private router = inject(Router);

  reportForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;
  reportResult: ReportResponse | null = null;

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.reportForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const request: ReportRequest = {
        startDate: this.reportForm.get('startDate')?.value,
        endDate: this.reportForm.get('endDate')?.value
      };

      this.reportService.generateTransactionReport(request).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.reportResult = response;
          this.successMessage = `Report generation initiated! Job ID: ${response.jobId}`;
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Report generation failed. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Please select both start and end dates';
    }
  }

  onClear(): void {
    this.reportForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
    this.reportResult = null;
  }

  onBack(): void {
    this.router.navigate(['/main-menu']);
  }
}
