import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../core/services/report.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reportForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  reportData: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private reportService: ReportService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.reportForm = this.formBuilder.group({
      reportType: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
  }

  onGenerateReport(): void {
    if (this.reportForm.invalid) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.reportData = null;

    const reportParams = {
      startDate: this.reportForm.value.startDate,
      endDate: this.reportForm.value.endDate
    };
    
    this.reportService.generateTransactionReport(reportParams).subscribe({
      next: (data) => {
        this.reportData = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to generate report';
        this.isLoading = false;
      }
    });
  }

  clearForm(): void {
    this.reportForm.reset();
    this.reportData = null;
    this.errorMessage = '';
  }

  goBack(): void {
    if (this.authService.isAdmin) {
      this.router.navigate(['/admin-menu']);
    } else {
      this.router.navigate(['/menu']);
    }
  }

  get reportType() {
    return this.reportForm.get('reportType');
  }

  get startDate() {
    return this.reportForm.get('startDate');
  }

  get endDate() {
    return this.reportForm.get('endDate');
  }
}
