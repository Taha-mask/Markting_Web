import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-trending-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trending-sidebar.component.html',
  styleUrls: ['./trending-sidebar.component.css']
})
export class TrendingSidebarComponent implements OnInit {
  followingCount: number = 0;
  
  user: User[] = [
    {
      id: '1',
      username: 'Taha Mahmoud',
      type: 'Markter',
      profileImageUrl: 'images/user-1.png',
      status: 'Online',
      role: 'user'
    }
  ];

  ngOnInit() {
    // Initialize following count based on actual followed users
    this.initializeFollowingCount();
  }

  private initializeFollowingCount() {
    // Get initial count from localStorage if available
    const savedCount = localStorage.getItem('followingCount');
    this.followingCount = savedCount ? parseInt(savedCount, 10) : 5;
  }

  incrementFollowingCount() {
    this.followingCount++;
    // Save updated count
    localStorage.setItem('followingCount', this.followingCount.toString());
    // Trigger smooth animation for count update
    const countElement = document.querySelector('.my-following');
    if (countElement) {
      countElement.classList.add('count-update');
      setTimeout(() => countElement.classList.remove('count-update'), 300);
    }
  }
  
  decrementFollowingCount() {
    if (this.followingCount > 0) {
      this.followingCount--;
      // Save updated count
      localStorage.setItem('followingCount', this.followingCount.toString());
      // Trigger smooth animation for count update
      const countElement = document.querySelector('.my-following');
      if (countElement) {
        countElement.classList.add('count-update');
        setTimeout(() => countElement.classList.remove('count-update'), 300);
      }
    }
  }

  getUserTypeText(): string {
    return this.user[0].type === 'Markter' ? 'Marketing Professional' : 'User';
  }
}
