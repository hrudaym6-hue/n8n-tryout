import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
  addForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      userId: ['', [Validators.required]],
      password: ['', [Validators.required]],
      userType: ['', [Validators.required, Validators.pattern(/^[RA]$/)]]
    });
  }

  onSubmit(): void {
    if (this.addForm.invalid) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const userData = this.addForm.value;
    
    this.userService.addUser(userData).subscribe({
      next: () => {
        this.successMessage = 'User added successfully';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/users']);
        }, 1500);
      },
      error: (error) => {
        if (error.status === 409) {
          this.errorMessage = 'User ID already exists';
        } else {
          this.errorMessage = 'Failed to add user';
        }
        this.isLoading = false;
      }
    });
  }

  clearForm(): void {
    this.addForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
