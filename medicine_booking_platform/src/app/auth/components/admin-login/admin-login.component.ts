import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirect if already logged in as admin
    if (this.authService.isAuthenticated() && this.authService.hasRole('admin')) {
      this.router.navigate(['/admin/dashboard']);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      adminCode: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login({
      email: this.f['email'].value,
      password: this.f['password'].value,
      role: 'admin'
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMessage = response.message;
          this.loading = false;
        }
      },
      error: (error) => {
        this.errorMessage = 'Admin authentication failed. Please verify your credentials.';
        this.loading = false;
      }
    });
  }

  navigateToUserLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}