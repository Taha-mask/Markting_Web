// src/app/services/user.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userType: string = 'customer'; // القيمة الافتراضية
  private followingCount: number = 618; // القيمة الافتراضية لعدد المتابعين

  // دالة لتحديد نوع المستخدم
  setUserType(type: string) {
    this.userType = type;
  }

  // دالة للحصول على نوع المستخدم
  getUserType(): string {
    return this.userType;
  }

  // دالة للحصول على عدد المتابعين
  getFollowingCount(): number {
    return this.followingCount;
  }

  // دالة لزيادة عدد المتابعين
  incrementFollowingCount() {
    this.followingCount++;
  }

  // دالة لتقليل عدد المتابعين
  decrementFollowingCount() {
    this.followingCount--;
  }
}
