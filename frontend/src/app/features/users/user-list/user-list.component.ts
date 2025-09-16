import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = true;
  error?: string;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => { this.users = users; this.loading = false; },
      error: (err) => { this.loading = false; this.error = 'Failed to load users'; }
    });
  }

  deleteUser(id: number) {
    if (confirm('Delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.loadUsers()
      });
    }
  }
}
