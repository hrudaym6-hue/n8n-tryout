import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css'],
  standalone: false
})
export class UserUpdateComponent implements OnInit {
  userForm: FormGroup;
  loading = false;
  loadingUser = false;
  errorMessage = '';
  successMessage = '';
  userId = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
      lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
      userType: ['U', Validators.required],
      password: ['', [Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      if (this.userId) {
        this.loadUser();
      } else {
        this.errorMessage = 'User ID not provided';
      }
    });
  }

  loadUser(): void {
    this.loadingUser = true;
    this.errorMessage = '';

    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          firstName: user.first_name,
          lastName: user.last_name,
          userType: user.user_type
        });
        this.loadingUser = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load user. Please try again.';
        console.error('Error loading user:', error);
        this.loadingUser = false;
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateData: any = {
      first_name: this.userForm.value.firstName,
      last_name: this.userForm.value.lastName,
      user_type: this.userForm.value.userType
    };

    if (this.userForm.value.password) {
      updateData.password = this.userForm.value.password;
    }

    this.userService.updateUser(this.userId, updateData).subscribe({
      next: () => {
        this.successMessage = 'User updated successfully!';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/admin/users']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Failed to update user. Please try again.';
        console.error('Error updating user:', error);
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/users']);
  }

  get firstName() { return this.userForm.get('firstName'); }
  get lastName() { return this.userForm.get('lastName'); }
  get userType() { return this.userForm.get('userType'); }
  get password() { return this.userForm.get('password'); }
}
