import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificationComponent } from './notification.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TrendingSidebarComponent } from '../trending-sidebar/trending-sidebar.component';

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

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NotificationComponent,
        BrowserAnimationsModule,
        CommonModule
      ],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    
    // Setup mock notifications
    component.notifications = [
      {
        id: 1,
        avatar: 'images/user-1.png',
        username: 'John Doe',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        type: 'like',
        isRead: false,
        content: 'liked your post "Angular Development Tips"',
        link: '/posts/1'
      },
      {
        id: 2,
        avatar: 'images/user-3.png',
        username: 'Alex Johnson',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        content: 'Shared your Post "Top 10 Marketing Tricks"',
        type: 'share',
        isRead: true,
        link: '/posts/2'
      }
    ];
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Rendering Tests', () => {
    it('should render all notifications initially', () => {
      const notificationElements = fixture.nativeElement.querySelectorAll('.notification');
      expect(notificationElements.length).toBe(component.notifications.length);
    });

    it('should update view when notification is marked as read', fakeAsync(async () => {
      const notification = component.notifications[0];
      const notificationElement = fixture.nativeElement.querySelector('.notification');
      
      expect(notification.isRead).toBeFalse();
      expect(notificationElement.classList.contains('unread')).toBeTrue();
      
      await component.markAsRead(notification);
      fixture.detectChanges();
      tick(300);
      
      expect(notification.isRead).toBeTrue();
      expect(notificationElement.classList.contains('unread')).toBeFalse();
    }));

    it('should update unread count badge', fakeAsync(async () => {
      const initialCount = component.notifications.filter((n: Notification) => !n.isRead).length;
      const badge = fixture.nativeElement.querySelector('.badge');
      expect(badge.textContent.trim()).toBe(initialCount.toString());

      await component.markAllAsRead();
      fixture.detectChanges();
      tick(300);

      expect(component.notifications.every((n: Notification) => n.isRead)).toBeTrue();
      expect(component.unreadCount).toBe(0);
    }));
  });

  describe('Design Tests', () => {
    it('should have visible notification elements', () => {
      const notifications = fixture.nativeElement.querySelectorAll('.notification');
      notifications.forEach((notification: Element) => {
        const styles = window.getComputedStyle(notification);
        expect(styles.display).not.toBe('none');
        expect(styles.visibility).not.toBe('hidden');
        expect(styles.opacity).not.toBe('0');
      });
    });

    it('should have proper flex layout', () => {
      const notificationsWrapper = fixture.nativeElement.querySelector('.notifications-wrapper');
      const styles = window.getComputedStyle(notificationsWrapper);
      expect(styles.display).toBe('flex');
      expect(styles.flexDirection).toBe('column');
    });
  });

  describe('Animation Tests', () => {
    it('should apply animation on notification deletion', fakeAsync(async () => {
      const notification = fixture.nativeElement.querySelector('.notification');
      await component.deleteNotification(1);
      fixture.detectChanges();
      
      const styles = window.getComputedStyle(notification);
      expect(styles.animation).toBeDefined();
      tick(300);
      fixture.detectChanges();

      expect(component.notifications.length).toBe(1);
    }));
  });

  describe('Filtering and Sorting Tests', () => {
    it('should filter unread notifications', () => {
      const unreadNotifications = component.notifications.filter((n: Notification) => !n.isRead);
      component.filterType = 'unread';
      component.updateFilteredNotifications();
      fixture.detectChanges();
      
      expect(component.filteredNotifications.length).toBe(unreadNotifications.length);
      expect(component.filteredNotifications.every((n: Notification) => !n.isRead)).toBeTrue();
    });

    it('should sort notifications by timestamp', () => {
      component.sortOrder = 'newest';
      component.updateFilteredNotifications();
      let sortedNotifications = component.filteredNotifications;
      
      for (let i = 1; i < sortedNotifications.length; i++) {
        const prev = new Date(sortedNotifications[i-1].timestamp).getTime();
        const curr = new Date(sortedNotifications[i].timestamp).getTime();
        expect(prev).toBeGreaterThanOrEqual(curr);
      }

      component.sortOrder = 'oldest';
      component.updateFilteredNotifications();
      fixture.detectChanges();
      sortedNotifications = component.filteredNotifications;
      
      for (let i = 1; i < sortedNotifications.length; i++) {
        const prev = new Date(sortedNotifications[i-1].timestamp).getTime();
        const curr = new Date(sortedNotifications[i].timestamp).getTime();
        expect(prev).toBeLessThanOrEqual(curr);
      }
    });

    it('should correctly format time ago', () => {
      const now = Date.now();
      const fiveMinutesAgo = new Date(now - 5 * 60 * 1000).toISOString();
      const fiveHoursAgo = new Date(now - 5 * 60 * 60 * 1000).toISOString();
      
      expect(component.getTimeAgo(fiveMinutesAgo)).toContain('minutes ago');
      expect(component.getTimeAgo(fiveHoursAgo)).toContain('hours ago');
    });
  });
});