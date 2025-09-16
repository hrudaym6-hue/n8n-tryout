import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user?: User;
  loading = true;
  error?: string;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    this.userService.getUser(userId).subscribe({
      next: (user) => { this.user = user; this.loading = false; },
      error: () => { this.error = 'User not found'; this.loading = false; }
    });
  }
}
