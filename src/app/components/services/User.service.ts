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
  private apiUrl: string = 'http://brandit.runasp.net/api'; // Updated Backend API URL

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

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/Upload/UploadImage`, formData);
  }

  formDataToUserDto(formData: FormData, userType: string): any {
    // Convert FormData to a UserDto object that matches the backend API
    const userDto: any = {
      Email: formData.get('email') as string,
      FirstName: formData.get('firstName') as string,
      LastName: formData.get('lastName') as string,
      Password: formData.get('password') as string,
      PhoneNumber: formData.get('phone') as string,
      Gender: (formData.get('gender') as string) === 'male' ? 'M' : 'F',
      BirthDate: formData.get('birthDate') as string,
      Country: formData.get('country') as string,
      City: '',  // Default values for fields not in the form
      Street: '',
      Description: formData.get('companyDescription') as string,
      AcceptTerms: formData.get('termsAccepted') === 'true',
      UserType: userType === 'Marketer' ? 1 : 0  // 1 for Marketer, 0 for Customer
    };

    // Add marketer-specific fields if this is a marketer registration
    if (userType === 'Marketer') {
      userDto.CompanyName = formData.get('companyName') as string;
      userDto.Companywebsite = formData.get('companyWebsite') as string || null;
    }

    return userDto;
  }

  registerMarketer(data: any): Observable<RegistrationResponse> {
    console.log('Sending marketer registration data to API:', data);
    // Call the backend API endpoint for marketer registration with JSON data
    return this.http.post<RegistrationResponse>(`${this.apiUrl}/User/RegisterMarketer`, data).pipe(
      catchError(this.handleError),
      map(response => {
        console.log('Registration response received:', response);
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.isAuthenticatedSubject.next(true);
          
          // Create a user object if not provided in response
          if (!response.user && response.userId) {
            const user = {
              id: response.userId,
              email: data.Email,
              firstName: data.FirstName,
              lastName: data.LastName,
              userType: 'Marketer',
              profilePicturePath: data.ProfilePicturePath
            };
            response.user = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
          } else if (response.user) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
        }
        return response;
      })
    );
  }

  registerUser(formData: FormData): Observable<RegistrationResponse> {
    // Convert FormData to a UserDto object that matches the backend API
    const userDto = this.formDataToUserDto(formData, 'Customer');

    // Call the backend API endpoint for customer registration
    return this.http.post<RegistrationResponse>(`${this.apiUrl}/User/RegisterCustomer`, userDto).pipe(
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
    console.log('Attempting login with:', { email });
    // Format the request body according to API expectations
    const body = { 
      Email: email, 
      Password: password 
    };
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/User/Login`, body).pipe(
      catchError(this.handleError),
      map(response => {
        console.log('Login response received:', response);
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.isAuthenticatedSubject.next(true);
          
          // Store user information if available
          if (response.user) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
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
