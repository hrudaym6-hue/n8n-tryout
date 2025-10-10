import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  standalone: false
})
export class ReportsComponent {
  constructor(private router: Router) {}

  onBackToMenu(): void {
    this.router.navigate(['/menu']);
  }
}
