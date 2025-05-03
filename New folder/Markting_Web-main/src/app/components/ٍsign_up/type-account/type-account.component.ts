// src/app/type-account/type-account.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-type-account',
  templateUrl: './type-account.component.html',
  styleUrls: ['./type-account.component.css'],
})
export class TypeAccountComponent {
  constructor(private router: Router) {}

  selectAccountType(type: string) {
    if (type === 'marketer') {
      this.router.navigate(['/signup-marketer']); // توجيه إلى صفحة تسجيل المسوق
    } else if (type === 'customer') {
      this.router.navigate(['/signup-user']); // توجيه إلى صفحة تسجيل المستخدم
    }
  }
}