// src/app/services/user.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userType: string = 'customer'; // القيمة الافتراضية

  setUserType(type: string) {
    this.userType = type;
  }

  getUserType(): string {
    return this.userType;
  }
}