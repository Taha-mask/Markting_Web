import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // إضافة CommonModule

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule, FormsModule],  // إضافة CommonModule هنا
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent {
  showAllActivities = true;
  searchText = '';

  activities = [
    { name: 'Shahd', text: 'posted a new post in her profile.', image: '/assets/images/profile2.jpg', date: new Date('2025-04-20') },
    { name: 'Shahd', text: 'commented on Sara\'s post.', image: '/assets/images/pic4.jpg', date: new Date('2025-04-19') },
    { name: 'Shahd', text: 'reacted to Sara\'s post.', image: '/assets/images/cat.jpg', date: new Date('2025-04-18') }
  ];

  toggleActivities(): void {
    this.showAllActivities = !this.showAllActivities;
  }

  // Sort activities by newest (descending)
  sortByNewest(): void {
    this.activities = [...this.activities].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // Sort activities by oldest (ascending)
  sortByOldest(): void {
    this.activities = [...this.activities].sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  // Filter activities based on search text
  get filteredActivities() {
    return this.activities.filter(activity =>
      activity.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      activity.text.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
