import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/User.service';

@Component({
  selector: 'app-trending-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trending-sidebar.component.html',
  styleUrls: ['./trending-sidebar.component.css']
})
export class TrendingSidebarComponent implements OnInit {
  followingCount: number = 0;
  currentUser: User = {
    id: '1',
    username: 'Guest User',
    type: 'User',
    profileImageUrl: 'assets/images/default-profile.png',
    status: 'Offline',
    role: 'user'
  };

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.initializeFollowingCount();
    this.loadCurrentUserData();
  }

  private initializeFollowingCount() {
    const savedCount = localStorage.getItem('followingCount');
    this.followingCount = savedCount ? parseInt(savedCount, 10) : 5;
  }

  incrementFollowingCount() {
    this.followingCount++;
    localStorage.setItem('followingCount', this.followingCount.toString());
    this.animateCountUpdate();
  }

  decrementFollowingCount() {
    if (this.followingCount > 0) {
      this.followingCount--;
      localStorage.setItem('followingCount', this.followingCount.toString());
      this.animateCountUpdate();
    }
  }

  private animateCountUpdate() {
    const countElement = document.querySelector('.my-following');
    if (countElement) {
      countElement.classList.add('count-update');
      setTimeout(() => countElement.classList.remove('count-update'), 300);
    }
  }

  getUserTypeText(): string {
    return this.currentUser.type === 'Markter' ? 'Marketing Professional' : 'User';
  }

  private loadCurrentUserData(): void {
    const currentUserStr = localStorage.getItem('currentUser');

    if (currentUserStr) {
      try {
        const userData = JSON.parse(currentUserStr);
        if (userData) {
          // Combine first and last name
          const fullName = userData.firstName && userData.lastName ?
            `${userData.firstName} ${userData.lastName}` :
            (userData.username || userData.userName || 'Guest User');

          this.currentUser = {
            id: userData.id || userData.userId || '1',
            username: fullName,
            type: userData.userType === 0 ? 'User' : 'Markter',
            profileImageUrl: userData.profileImageUrl || userData.profilePictureUrl || 'assets/images/default-profile.png',
            status: 'Online',
            role: userData.userType === 0 ? 'user' : 'marketer'
          };
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    } else {
      // If no user in localStorage, try to get from UserService
      const userId = this.userService.getCurrentUserId();
      if (userId && userId !== '1') {
        this.userService.getUserProfile(userId).subscribe({
          next: (userData) => {
            if (userData && !userData.error) {
              // Combine first and last name
              const fullName = userData.firstName && userData.lastName ?
                `${userData.firstName} ${userData.lastName}` :
                (userData.username || userData.userName || 'Guest User');

              this.currentUser = {
                id: userData.id || userData.userId || '1',
                username: fullName,
                type: userData.userType === 0 ? 'User' : 'Markter',
                profileImageUrl: userData.profileImageUrl || userData.profilePictureUrl || 'assets/images/default-profile.png',
                status: 'Online',
                role: userData.userType === 0 ? 'user' : 'marketer'
              };
            }
          },
          error: (error) => {
            console.error('Error fetching user profile:', error);
          }
        });
      }
    }
  }
}
