import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService } from '../../services/User.service';
import { CommonModule } from '@angular/common';
import { Subject, from } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import * as bootstrap from 'bootstrap';
import { FooterComponent } from '../footer/footer.component';
import { FirebaseService, User } from '../../services/firebase.service';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

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
    private authService: AuthService,
    private firebaseService: FirebaseService
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

  passwordStrengthValidator(control: any) {
    const password = control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const valid = hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && password.length >= 8;
    return valid ? null : { weakPassword: true };
  }

  calculatePasswordStrength(password: string): number {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  }

  async onSubmit() {
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

    try {
      const userCredential = await this.firebaseService.login(email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userData = await this.firebaseService.getUserByUserId(user.uid) as User;

      if (userData) {
        // Store user data in local storage
        localStorage.setItem('currentUser', JSON.stringify({
          ...userData,
          email: user.email
        }));

        // Navigate based on user role
        if (userData.role === 'marketer') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/feed']);
        }
      } else {
        this.loginError = 'User data not found. Please try again.';
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      this.loginError = error.message || 'An error occurred during login. Please try again later.';
    } finally {
      this.isLoading = false;
    }
  }

  async resetPassword() {
    if (!this.resetEmail) return;

    this.isResetting = true;
    this.resetError = '';
    this.resetSuccess = false;

    try {
      await this.authService.sendPasswordResetEmail(this.resetEmail);
      this.resetSuccess = true;
      this.resetEmail = '';

      const modalElement = document.getElementById('forgetPasswordModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal?.hide();
      }

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

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.firebaseService.getAuth(), provider);

      // Get user data from Firestore
      const userData = await this.firebaseService.getUserByUserId(result.user.uid) as User;

      if (userData) {
        // Store user data in local storage
        localStorage.setItem('currentUser', JSON.stringify({
          ...userData,
          email: result.user.email
        }));

        // Navigate based on user role
        if (userData.role === 'marketer') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/feed']);
        }
      } else {
        // If user doesn't exist in Firestore, create new user
        const newUser = {
          firstName: result.user.displayName?.split(' ')[0] || '',
          lastName: result.user.displayName?.split(' ')[1] || '',
          email: result.user.email || '',
          phone: result.user.phoneNumber || '',
          role: 'user',
          profileImage: result.user.photoURL || ''
        };

        await this.firebaseService.addUser(newUser);
        this.router.navigate(['/feed']);
      }
    } catch (error: any) {
      console.error('Google login failed:', error);
      this.loginError = error.message || 'Google login failed. Please try again.';
    }
  }

  async loginWithFacebook() {
    try {
      const result = await this.userService.loginWithFacebook();
      if (result) {
        this.router.navigate(['/feed']);
      }
    } catch (error) {
      console.error('Facebook login failed:', error);
      this.loginError = 'Facebook login failed. Please try again.';
    }
  }
}
