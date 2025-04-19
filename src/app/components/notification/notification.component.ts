import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TrendingSidebarComponent } from '../trending-sidebar/trending-sidebar.component';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';

interface Notification {
  id: number;
  avatar: string;
  username: string;
  timestamp: string;
  content?: string;
  type: 'like' | 'comment' | 'share' | 'friend_request' | 'mention';
  isRead: boolean;
  link?: string;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [TrendingSidebarComponent, CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  animations: [
    trigger('notificationAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  unreadCount: number = 0;
  filterType: 'all' | 'unread' = 'all';
  sortOrder: 'newest' | 'oldest' = 'newest';
  isLoading: boolean = true;

  private readonly timeFormats = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  private async loadNotifications() {
    this.isLoading = true;
    
    // Simulated API call
    this.notifications = [
      {
        id: 1,
        avatar: 'images/user-1.png',
        username: 'John Doe',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        type: 'like',
        isRead: false,
        content: 'liked your post "Angular Development Tips"',
        link: '/posts/1'
      },
      {
        id: 2,
        avatar: 'images/user-2.png',
        username: 'Alex Johnson',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        content: 'Shared your Post "Top 10 Marketing Tricks"',
        type: 'share',
        isRead: false,
        link: '/posts/2'
      },
      {
        id: 3,
        avatar: 'images/user-3.png',
        username: 'Daimon Salvatore',
        timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7 hours ago
        content: 'mentioned you in a comment: "Hey @user, great insights!"',
        type: 'mention',
        isRead: true,
        link: '/comments/3'
      }
    ];

    this.updateFilteredNotifications();
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  trackByFn(index: number, notification: Notification): number {
    return notification.id;
  }

  async markAsRead(notification: Notification) {
    if (notification.isRead) return;

    notification.isRead = true;
    this.updateUnreadCount();
    this.updateFilteredNotifications();

    // Simulated API call to update server
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  async markAllAsRead() {
    const unreadNotifications = this.notifications.filter(n => !n.isRead);
    if (unreadNotifications.length === 0) return;

    unreadNotifications.forEach(n => n.isRead = true);
    this.updateUnreadCount();
    this.updateFilteredNotifications();

    // Simulated API call to update server
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  async deleteNotification(id: number) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.updateUnreadCount();
    this.updateFilteredNotifications();

    // Simulated API call to update server
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  private updateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.isRead).length;
  }

  updateFilteredNotifications() {
    let filtered = [...this.notifications];
    
    if (this.filterType === 'unread') {
      filtered = filtered.filter(n => !n.isRead);
    }

    filtered.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return this.sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

    this.filteredNotifications = filtered;
    this.updateUnreadCount();
  }

  toggleFilter() {
    this.filterType = this.filterType === 'all' ? 'unread' : 'all';
    this.updateFilteredNotifications();
  }

  toggleSort() {
    this.sortOrder = this.sortOrder === 'newest' ? 'oldest' : 'newest';
    this.updateFilteredNotifications();
  }

  getTimeAgo(timestamp: string): string {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds} seconds ago`;
    
    for (const [unit, secondsInUnit] of Object.entries(this.timeFormats)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }
    
    return new Date(timestamp).toLocaleDateString();
  }

  getNotificationIcon(type: string): string {
    switch(type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'share': return '🔄';
      case 'friend_request': return '👥';
      case 'mention': return '@';
      default: return '📢';
    }
  }

  navigateToContent(link: string | undefined) {
    if (link) {
      this.router.navigate([link]);
    }
  }
}