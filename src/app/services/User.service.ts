import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl || 'https://api.example.com';
  private userType: string = '';

  constructor(private http: HttpClient) { }

  // Login user
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/login`, { email, password })
      .pipe(
        map((response: any) => {
          // Store user token and data in localStorage
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId || response.id || '1');
            localStorage.setItem('currentUser', JSON.stringify(response));
          }
          return response;
        }),
        catchError(error => {
          console.error('Login error:', error);
          return of({ error: error.message || 'Login failed' });
        })
      );
  }

  // Register user
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/register`, userData)
      .pipe(
        map((response: any) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId || response.id || '1');
            localStorage.setItem('currentUser', JSON.stringify(response));
            this.setUserType('customer');
          }
          return response;
        }),
        catchError(error => {
          console.error('Registration error:', error);
          return of({ error: error.message || 'Registration failed' });
        })
      );
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get user profile
  getUserProfile(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching user profile:', error);
          return of({ error: error.message || 'Failed to fetch user profile' });
        })
      );
  }

  // Update user profile
  updateUserProfile(userId: string, profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}`, profileData)
      .pipe(
        catchError(error => {
          console.error('Error updating user profile:', error);
          return of({ error: error.message || 'Failed to update user profile' });
        })
      );
  }

  // Get current user ID
  getCurrentUserId(): string {
    return localStorage.getItem('userId') || '1';
  }

  // OAuth login methods
  loginWithGoogle(): Observable<any> {
    // This is a mock implementation - replace with actual Google OAuth integration
    return this.http.post(`${this.apiUrl}/auth/google`, {})
      .pipe(
        map((response: any) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId || '1');
          }
          return response;
        }),
        catchError(error => {
          console.error('Google login error:', error);
          return of({ error: error.message || 'Google login failed' });
        })
      );
  }

  loginWithFacebook(): Observable<any> {
    // This is a mock implementation - replace with actual Facebook OAuth integration
    return this.http.post(`${this.apiUrl}/auth/facebook`, {})
      .pipe(
        map((response: any) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId || '1');
          }
          return response;
        }),
        catchError(error => {
          console.error('Facebook login error:', error);
          return of({ error: error.message || 'Facebook login failed' });
        })
      );
  }

  // Set user type
  setUserType(userType: string): void {
    this.userType = userType;
    localStorage.setItem('userType', userType);
  }

  // Get user type
  getUserType(): string {
    return this.userType || localStorage.getItem('userType') || '';
  }

  // Upload file
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(`${this.apiUrl}/Upload/UploadImage`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => error);
  }

  // Register marketer
  registerMarketer(marketerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/register-marketer`, marketerData)
      .pipe(
        map((response: any) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId || response.id || '1');
            localStorage.setItem('currentUser', JSON.stringify(response));
            this.setUserType('marketer');
          }
          return response;
        }),
        catchError(error => {
          console.error('Marketer registration error:', error);
          return of({ error: error.message || 'Marketer registration failed' });
        })
      );
  }

  // Register customer/user
  registerUser(userData: any): Observable<any> {
    // Format data according to API expectations
    const formattedData = this.formatUserData(userData);

    return this.http.post(`${this.apiUrl}/Auth/register`, formattedData)
      .pipe(
        map((response: any) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId || response.id || '1');
            localStorage.setItem('currentUser', JSON.stringify(response));
            this.setUserType('customer');
          }
          return response;
        }),
        catchError(error => {
          console.error('Customer registration error:', error);
          return of({ error: error.message || 'Customer registration failed' });
        })
      );
  }

  // Helper method to format user data for API
  private formatUserData(userData: any): any {
    // If userData is FormData, extract values and format
    if (userData instanceof FormData) {
      const formattedData: any = {
        FirstName: userData.get('firstName'),
        LastName: userData.get('secondName'),
        Email: userData.get('email'),
        Password: userData.get('password'),
        PhoneNumber: userData.get('phone'),
        Gender: userData.get('gender') === 'male' ? 'M' : 'F',
        UserType: 0, // 0 for Customer
        AcceptTerms: userData.get('termsAccepted') === 'true',
        Status: 'active',
        CreatedAt: new Date().toISOString().split('T')[0]
      };

      // Add birth date if provided
      const birthDate = userData.get('birthDate');
      if (birthDate) {
        formattedData.BirthDate = new Date(birthDate.toString()).toISOString().split('T')[0];
      }

      // Add profile image if provided
      const profileImage = userData.get('profileImage');
      if (profileImage instanceof File) {
        formattedData.ProfileImage = profileImage;
      }

      return formattedData;
    }

    // If userData is already an object
    return {
      FirstName: userData.firstName,
      LastName: userData.secondName || userData.lastName,
      Email: userData.email,
      Password: userData.password,
      PhoneNumber: userData.phone,
      Gender: userData.gender === 'male' ? 'M' : 'F',
      UserType: 0, // 0 for Customer
      AcceptTerms: userData.termsAccepted === true,
      Status: 'active',
      CreatedAt: new Date().toISOString().split('T')[0],
      BirthDate: userData.birthDate ? new Date(userData.birthDate).toISOString().split('T')[0] : null,
      ProfileImage: userData.profileImage
    };
  }
}
