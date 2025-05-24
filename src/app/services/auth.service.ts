import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apiService: ApiService) {}

  getCurrentUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  getUserId(): string {
    const user = this.getCurrentUser();
    return user?.id || '';
  }

  updateUserProfile(user: User): Observable<User> {
    return this.apiService.put<User>(`users/${user.username}`, user);
  }

  changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return this.apiService.post('users/change-password', { currentPassword, newPassword }).toPromise() as Promise<void>;
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      // Here you would typically make an API call to your backend
      // to initiate the password reset process
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }
    } catch (error) {
      console.error('Error sending reset email:', error);
      throw error;
    }
  }
} 