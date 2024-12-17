import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {  ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {



    // يمكن إضافة بعض الكود داخل المُنشئ إذا لزم الأمر



  @ViewChild('profileMenu') profileMenu!: ElementRef;

  constructor(private router: Router) {}

  // دالة لتبديل حالة القائمة
  toggleMenu(): void {
    if (this.profileMenu) {
      this.profileMenu.nativeElement.classList.toggle("open-menu");
    }
  }
}

