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

  updateUserProfile(user: User): Observable<User> {
    return this.apiService.put<User>(`users/${user.username}`, user);
  }

  changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return this.apiService.post('users/change-password', { currentPassword, newPassword }).toPromise() as Promise<void>;
  }
} 