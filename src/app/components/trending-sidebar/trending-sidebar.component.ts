import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../user';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/User.service';

@Component({
  selector: 'app-trending-sidebar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './trending-sidebar.component.html',
  styleUrls: ['./trending-sidebar.component.css']
})
export class TrendingSidebarComponent implements OnInit {
  profileImageUrl = 'https://randomuser.me/api/portraits/men/1.jpg'; // Sample profile image
  user: User[] = [
    {
      username: 'Taha Mahmoud ',
      type: 'Markter',
      profileImageUrl: 'images/user-1.png',
      status: 'online',
    }
  ];

  activeLink: string = 'feed';

  constructor(private router: Router, private userService: UserService) {}


  setActiveLink(link: string) {
    this.activeLink = link;
  }

  userType: string = 'customer'; // القيمة الافتراضية

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.urlAfterRedirects.includes('/feed')) {
        this.activeLink = 'feed';
      } else if (event.urlAfterRedirects.includes('/explore')) {
        this.activeLink = 'explore';
      } else {
        this.activeLink = 'feed'; // Default to feed if no match
      }
    });

    this.userType = this.userService.getUserType(); // جلب نوع المستخدم من الخدمة
  }

  getUserTypeText(): string {
    return this.userType === 'marketer' ? 'Marketer' : 'Customer'; // عرض النص المناسب
  }

}
