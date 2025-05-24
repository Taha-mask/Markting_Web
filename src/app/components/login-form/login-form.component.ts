import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService } from '../../services/User.service';
import { LoginResponse, ApiError } from '../models/auth.model';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import * as bootstrap from 'bootstrap';
import { FooterComponent } from '../footer/footer.component';

interface OAuthResponse {
  token: string;
  userId: string;
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, FooterComponent],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  loginError: string | null = null;
  passwordStrength = 0;
  private destroy$ = new Subject<void>();
  email: string = '';
  password: string = '';
  resetEmail: string = '';
  isResetting: boolean = false;
  resetSuccess: boolean = false;
  resetError: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        this.passwordStrengthValidator
      ]],
      rememberMe: [false],
    });

    // Password strength tracking
    this.loginForm.get('password')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(password => {
        this.passwordStrength = this.calculatePasswordStrength(password);
      });
  }

  ngOnInit() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.loginForm.patchValue({
        email: rememberedEmail,
        rememberMe: true,
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Custom password strength validator
  passwordStrengthValidator(control: any) {
    const password = control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    const valid = hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && password.length >= 8;
    return valid ? null : { weakPassword: true };
  }

  // Calculate password strength percentage
  calculatePasswordStrength(password: string): number {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  }

  // OAuth login methods with proper type annotations
  loginWithGoogle() {
    this.isLoading = true;
    this.loginError = null;

    // Simulated Google login method - replace with actual implementation
    this.userService.loginWithGoogle()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: OAuthResponse) => {
          this.isLoading = false;
          localStorage.setItem('token', response.token);
          this.router.navigate(['/feed']);
        },
        error: (error: ApiError) => {
          this.isLoading = false;
          this.loginError = error.message || 'Google login failed. Please try again.';
        }
      });
  }

  loginWithFacebook() {
    this.isLoading = true;
    this.loginError = null;

    // Simulated Facebook login method - replace with actual implementation
    this.userService.loginWithFacebook()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: OAuthResponse) => {
          this.isLoading = false;
          localStorage.setItem('token', response.token);
          this.router.navigate(['/feed']);
        },
        error: (error: ApiError) => {
          this.isLoading = false;
          this.loginError = error.message || 'Facebook login failed. Please try again.';
        }
      });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.loginError = null;

    const { email, password, rememberMe } = this.loginForm.value;

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    console.log('Submitting login request...');
    this.userService.login(email, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: LoginResponse) => {
          console.log('Login successful:', response);
          this.isLoading = false;
          
          // Store token in localStorage (already done in UserService)
          // Store user type if available
          if (response.user && response.user.userType) {
            this.userService.setUserType(response.user.userType);
          }
          
          // Navigate based on user type if available
          const userType = response.user?.userType?.toLowerCase() || '';
          if (userType === 'marketer' || userType === 'markter') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/feed']);
          }
        },
        error: (error: ApiError) => {
          console.error('Login failed:', error);
          this.isLoading = false;
          
          // Provide more specific error messages based on error status
          if (error.status === 400) {
            this.loginError = 'Invalid email or password. Please check your credentials and try again.';
          } else if (error.status === 401) {
            this.loginError = 'Unauthorized. Your account may be inactive or locked.';
          } else if (error.status === 404) {
            this.loginError = 'Account not found. Please check your email or register for a new account.';
          } else if (error.status === 0) {
            this.loginError = 'Unable to connect to the server. Please check your internet connection and try again.';
          } else {
            this.loginError = error.message || 'An error occurred during login. Please try again later.';
          }
        },
      });
  }

  async resetPassword() {
    if (!this.resetEmail) return;

    this.isResetting = true;
    this.resetError = '';
    this.resetSuccess = false;

    try {
      // Call your auth service's reset password method
      await this.authService.sendPasswordResetEmail(this.resetEmail);
      this.resetSuccess = true;
      this.resetEmail = '';
      
      // Show success message
      const modalElement = document.getElementById('forgetPasswordModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal?.hide();
      }
      
      // You can show a success toast or alert here
      alert('Password reset instructions have been sent to your email.');
      
    } catch (error: any) {
      this.resetError = error.message || 'Failed to send reset instructions. Please try again.';
    } finally {
      this.isResetting = false;
    }
  }

  closeResetModal() {
    const modalElement = document.getElementById('forgetPasswordModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }
}