import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  constructor(private router: Router) {}

  goToReport() {
    this.router.navigate(['/report']);
  }

  goToEntry() {
    this.router.navigate(['/entry']);
  }

  logout() {
    this.router.navigate(['/logout']);
  }
}

