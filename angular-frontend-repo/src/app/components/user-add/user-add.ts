import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CustomValidators } from '../../shared/validators';

@Component({
  selector: 'app-user-add',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-add.html',
  styleUrl: './user-add.scss'
})
export class UserAdd implements OnInit {
  userForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      userId: ['', [Validators.required, CustomValidators.alphanumeric()]],
      firstName: ['', [Validators.required, CustomValidators.alphanumeric()]],
      lastName: ['', [Validators.required, CustomValidators.alphanumeric()]],
      password: ['', [Validators.required]],
      userType: ['R', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.createUser(this.userForm.value).subscribe({
      next: (user) => {
        this.isSubmitting = false;
        this.successMessage = 'User created successfully';
        setTimeout(() => {
          this.router.navigate(['/user-list']);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to create user';
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/user-list']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
