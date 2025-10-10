import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css'],
  standalone: false
})
export class UserAddComponent implements OnInit {
  userForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      userId: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(8)]],
      firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
      lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userType: ['U', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const userData = {
      user_id: this.userForm.value.userId,
      first_name: this.userForm.value.firstName,
      last_name: this.userForm.value.lastName,
      password: this.userForm.value.password,
      user_type: this.userForm.value.userType
    };

    this.userService.createUser(userData).subscribe({
      next: () => {
        this.successMessage = 'User created successfully!';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/admin/users']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Failed to create user. Please try again.';
        console.error('Error creating user:', error);
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/users']);
  }

  get userId() { return this.userForm.get('userId'); }
  get firstName() { return this.userForm.get('firstName'); }
  get lastName() { return this.userForm.get('lastName'); }
  get password() { return this.userForm.get('password'); }
  get userType() { return this.userForm.get('userType'); }
}
