import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginResponse, RegistrationResponse, ApiError } from '../models/auth.model';
import { Router } from '@angular/router';

interface OAuthResponse {
  token: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userType: string = 'customer';
  private followingCount: number = 618;
  private apiUrl: string = 'https://example.com/api'; // Replace with your actual API URL
  
  // Observable for authentication state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isTokenValid());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  setUserType(type: string): void {
    this.userType = type;
  }

  getUserType(): string {
    return this.userType;
  }

  getFollowingCount(): number {
    return this.followingCount;
  }

  incrementFollowingCount(): void {
    this.followingCount++;
  }

  decrementFollowingCount(): void {
    if (this.followingCount > 0) {
      this.followingCount--;
    }
  }

  // Enhanced token validation method
  isTokenValid(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    // Basic token validation
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return false;

      // Decode payload
      const payload = JSON.parse(atob(tokenParts[1]));
      
      // Check expiration
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  // Comprehensive logout method
  logout(): Observable<any> {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  getCurrentUser(): any {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
  }

  updateUserPreference(key: string, value: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/user/preferences`, { 
      [key]: value 
    });
  }

  registerMarketer(formData: FormData): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${this.apiUrl}/auth/register-marketer`, formData).pipe(
      catchError(this.handleError),
      map(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.isAuthenticatedSubject.next(true);
        }
        return response;
      })
    );
  }

  registerUser(formData: FormData): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${this.apiUrl}/auth/register-user`, formData).pipe(
      catchError(this.handleError),
      map(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.isAuthenticatedSubject.next(true);
        }
        return response;
      })
    );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const body = { email, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, body).pipe(
      catchError(this.handleError),
      map(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.isAuthenticatedSubject.next(true);
        }
        return response;
      })
    );
  }

  // OAuth login methods
  loginWithGoogle(): Observable<OAuthResponse> {
    // Replace with actual Google OAuth login endpoint
    return this.http.post<OAuthResponse>(`${this.apiUrl}/auth/google-login`, {}).pipe(
      catchError(this.handleError),
      map(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.isAuthenticatedSubject.next(true);
        }
        return response;
      })
    );
  }

  loginWithFacebook(): Observable<OAuthResponse> {
    // Replace with actual Facebook OAuth login endpoint
    return this.http.post<OAuthResponse>(`${this.apiUrl}/auth/facebook-login`, {}).pipe(
      catchError(this.handleError),
      map(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.isAuthenticatedSubject.next(true);
        }
        return response;
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => ({ status: error.status, message: errorMessage } as ApiError));
  }
}