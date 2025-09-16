import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  editMode = false;
  userId?: number;
  loading = false;
  error?: string;

  constructor(
    private fb: FormBuilder, private userService: UserService,
    private route: ActivatedRoute, private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(128)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.editMode = Boolean(this.userId);

    if (this.editMode) {
      this.loading = true;
      this.userService.getUser(this.userId!).subscribe({
        next: (user) => {
          this.form.patchValue(user);
          this.loading = false;
        },
        error: () => { this.error = 'User not found'; this.loading = false; }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const user: User = this.form.value;
    if (this.editMode) {
      this.userService.updateUser(this.userId!, user).subscribe({
        next: () => this.router.navigate(['/users']),
        error: (err) => { this.error = err.error.error || 'Update failed'; this.loading = false; }
      });
    } else {
      this.userService.addUser(user).subscribe({
        next: () => this.router.navigate(['/users']),
        error: (err) => { this.error = err.error.error || 'Creation failed'; this.loading = false; }
      });
    }
  }
}
