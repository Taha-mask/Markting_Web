import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  getCurrentUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  getUserId(): string {
    const user = this.getCurrentUser();
    return user?.id || '';
  }

  updateUserProfile(user: User): Observable<User> {
    // Store updated user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    return of(user);
  }

  changePassword(currentPassword: string, newPassword: string): Promise<void> {
    // Implement with Firebase/Supabase when integrating authentication
    console.log('Password change functionality needs to be implemented with Firebase/Supabase');
    return Promise.resolve();
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    // Implement with Firebase/Supabase when integrating authentication
    console.log('Password reset functionality needs to be implemented with Firebase/Supabase');
    return Promise.resolve();
  }
} 