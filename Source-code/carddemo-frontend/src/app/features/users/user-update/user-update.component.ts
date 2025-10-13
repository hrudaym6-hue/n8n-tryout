import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
  updateForm!: FormGroup;
  user: User | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.updateForm = this.formBuilder.group({
      userId: [{value: '', disabled: true}],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      userType: ['', [Validators.required, Validators.pattern(/^[RA]$/)]]
    });

    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUser(userId);
    }
  }

  loadUser(userId: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.updateForm.patchValue({
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load user';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.updateForm.invalid || !this.user) {
      this.errorMessage = 'Please fix all validation errors';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateData = this.updateForm.value;
    
    this.userService.updateUser(this.user.userId, updateData).subscribe({
      next: () => {
        this.successMessage = 'User updated successfully';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/users']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Failed to update user';
        this.isLoading = false;
      }
    });
  }

  clearForm(): void {
    if (this.user) {
      this.updateForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        userType: this.user.userType
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
