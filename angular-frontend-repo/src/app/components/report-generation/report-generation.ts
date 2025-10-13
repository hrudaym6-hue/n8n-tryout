import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportService } from '../../services/report.service';
import { CustomValidators } from '../../shared/validators';

@Component({
  selector: 'app-report-generation',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './report-generation.html',
  styleUrl: './report-generation.scss'
})
export class ReportGeneration implements OnInit {
  reportForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isGenerating: boolean = false;
  reportUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      reportType: ['', [Validators.required]],
      startDate: ['', [Validators.required, CustomValidators.dateFormat()]],
      endDate: ['', [Validators.required, CustomValidators.dateFormat()]],
      accountId: ['', [CustomValidators.numeric(), CustomValidators.exactLength(11)]]
    });
  }

  onGenerate(): void {
    if (this.reportForm.invalid) {
      this.markFormGroupTouched(this.reportForm);
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.isGenerating = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.reportUrl = '';

    this.reportService.generateReport(this.reportForm.value).subscribe({
      next: (report) => {
        this.isGenerating = false;
        this.successMessage = 'Report generated successfully';
        this.reportUrl = report.reportUrl || '';
      },
      error: (error) => {
        this.isGenerating = false;
        this.errorMessage = error.error?.message || 'Failed to generate report';
      }
    });
  }

  onDownload(): void {
    if (this.reportUrl) {
      window.open(this.reportUrl, '_blank');
    }
  }

  onClear(): void {
    this.reportForm.reset({
      reportType: ''
    });
    this.errorMessage = '';
    this.successMessage = '';
    this.reportUrl = '';
  }

  goBack(): void {
    this.router.navigate(['/admin-menu']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
