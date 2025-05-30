import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService } from '../../services/User.service';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import * as bootstrap from 'bootstrap';
import { FooterComponent } from '../footer/footer.component';
import { FirebaseSupabaseService } from '../../services/firebase-supabase.service';

@Component({
    selector: 'app-login-form',
    imports: [ReactiveFormsModule, FormsModule, CommonModule, FooterComponent],
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  loginError: string | null = null;
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
    private authService: AuthService,
    private firebaseSupabaseService: FirebaseSupabaseService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  ngOnInit() {
    // Load remembered email if exists
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
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = this.showPassword ? 'text' : 'password';
    }
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      if (!this.loginForm.get('email')?.valid) {
        this.loginError = 'Please enter a valid email address';
      } else if (!this.loginForm.get('password')?.valid) {
        this.loginError = 'Please enter your password';
      }
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

    try {
      // Sign in with Firebase Authentication
      const userCredential = await this.firebaseSupabaseService.signIn(email, password);
      console.log('Login successful:', userCredential);

      // Get user data from Firestore
      const userDoc = await this.firebaseSupabaseService.getDocument('marketers', userCredential.user.uid);
      
      // Store user data in localStorage
      const userData = {
        uid: userCredential.user.uid,
        ...userDoc
      };
      localStorage.setItem('currentUser', JSON.stringify(userData));

      // Navigate based on user type
      if (userDoc && userDoc['role']?.toLowerCase() === 'marketer') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/feed']);
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      this.isLoading = false;
      
      // Provide detailed error messages
      switch (error.code) {
        case 'auth/user-not-found':
          this.loginError = 'Account not found. Please check your email or sign up';
          break;
        case 'auth/wrong-password':
          this.loginError = 'Incorrect password. Please try again';
          break;
        case 'auth/user-disabled':
          this.loginError = 'This account has been disabled. Please contact support';
          break;
        case 'auth/too-many-requests':
          this.loginError = 'Too many failed attempts. Please try again later';
          break;
        case 'auth/network-request-failed':
          this.loginError = 'Network error. Please check your internet connection';
          break;
        case 'auth/invalid-email':
          this.loginError = 'Invalid email format';
          break;
        case 'auth/invalid-credential':
          this.loginError = 'Invalid email or password';
          break;
        default:
          this.loginError = 'Login failed. Please check your credentials and try again';
      }
    } finally {
      this.isLoading = false;
    }
  }

  async resetPassword() {
    if (!this.resetEmail) {
      this.resetError = 'Please enter your email address';
      return;
    }

    if (!this.validateEmail(this.resetEmail)) {
      this.resetError = 'Please enter a valid email address';
      return;
    }

    this.isResetting = true;
    this.resetError = '';
    this.resetSuccess = false;

    try {
      // Call Firebase password reset
      await this.firebaseSupabaseService.resetPassword(this.resetEmail);
      this.resetSuccess = true;
      this.resetEmail = '';
      
      // Show success message
      const modalElement = document.getElementById('forgetPasswordModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal?.hide();
      }
      
      alert('Password reset instructions have been sent to your email');
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      switch (error.code) {
        case 'auth/user-not-found':
          this.resetError = 'No account found with this email address';
          break;
        case 'auth/invalid-email':
          this.resetError = 'Invalid email format';
          break;
        case 'auth/too-many-requests':
          this.resetError = 'Too many attempts. Please try again later';
          break;
        default:
          this.resetError = 'Failed to send reset instructions. Please try again';
      }
    } finally {
      this.isResetting = false;
    }
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  closeResetModal() {
    const modalElement = document.getElementById('forgetPasswordModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }
}