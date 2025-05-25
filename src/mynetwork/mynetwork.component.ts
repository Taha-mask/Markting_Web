import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mynetwork',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mynetwork.component.html',
  styleUrls: ['./mynetwork.component.css']
})
export class MynetworkComponent {
  activeTab: 'followers' | 'following' | 'suggestions' = 'followers';

  followers = [
    { id: 1, name: 'Ahmed Ali', title: 'User', mutual: '2 mutual friends', image: 'https://cdn-icons-png.flaticon.com/512/8676/8676442.png', status: 'Follow back' },
    { id: 2, name: 'Sara Mohamed', title: 'Markter', mutual: '1 mutual friend', image: 'https://cdn-icons-png.flaticon.com/512/8743/8743954.png', status: 'Follow back' },
    { id: 3, name: 'Ali', title: 'Makter', mutual: '2 mutual friends', image: 'https://cdn-icons-png.flaticon.com/512/8676/8676442.png', status: 'Follow back' },
    { id: 4, name: 'Sara', title: 'User', mutual: '1 mutual friend', image: 'https://cdn-icons-png.flaticon.com/512/8743/8743954.png', status: 'Follow back' },
    { id: 5, name: 'Ramy', title: 'User', mutual: '2 mutual friends', image: 'https://cdn-icons-png.flaticon.com/512/8676/8676442.png', status: 'Follow back' },
    { id: 6, name: 'Shahd', title: 'Markter', mutual: '1 mutual friend', image: 'https://cdn-icons-png.flaticon.com/512/8743/8743954.png', status: 'Follow back' },
  ];

  following = [
    { id: 1, name: 'Mohamed Hassan', title: 'Makter', mutual: '', image: 'https://cdn-icons-png.flaticon.com/512/8676/8676442.png', status: 'Unfollow' },
    { id: 2, name: 'Laila Ibrahim', title: 'Makter', mutual: '', image: 'https://cdn-icons-png.flaticon.com/512/8743/8743954.png', status: 'Unfollow' },
    { id: 3, name: 'Hassan', title: 'User', mutual: '', image: 'https://cdn-icons-png.flaticon.com/512/8676/8676442.png', status: 'Unfollow' },
    { id: 4, name: 'Roaa', title: 'User', mutual: '', image: 'https://cdn-icons-png.flaticon.com/512/8743/8743954.png', status: 'Unfollow' },
    { id: 5, name: 'Samy Nassr', title: 'User', mutual: '', image: 'https://cdn-icons-png.flaticon.com/512/8676/8676442.png', status: 'Unfollow' },
    { id: 6, name: 'Dalia Hosny', title: 'Makter', mutual: '', image: 'https://cdn-icons-png.flaticon.com/512/8743/8743954.png', status: 'Unfollow' },
  ];

  suggestions = [
    { id: 1, name: 'Omar Adel', title: 'User', mutual: '5 mutual friends', image: 'https://cdn-icons-png.flaticon.com/512/8676/8676442.png', status: 'Connect' },
    { id: 2, name: 'Nour Salah', title: 'Markter', mutual: '3 mutual friends', image: 'https://cdn-icons-png.flaticon.com/512/8743/8743954.png', status: 'Connect' },
    { id: 3, name: 'Adel mohammed', title: 'User', mutual: '5 mutual friends', image: 'https://cdn-icons-png.flaticon.com/512/8676/8676442.png', status: 'Connect' },
    { id: 4, name: 'Rania Ahmed', title: 'User', mutual: '3 mutual friends', image: 'https://cdn-icons-png.flaticon.com/512/8743/8743954.png', status: 'Connect' },
    { id: 5, name: 'Sayd mohamed', title: 'Markter', mutual: '5 mutual friends', image: 'https://cdn-icons-png.flaticon.com/512/8676/8676442.png', status: 'Connect' },
    { id: 6, name: 'Aliaa ashor', title: 'User', mutual: '3 mutual friends', image: 'https://cdn-icons-png.flaticon.com/512/8743/8743954.png', status: 'Connect' },
  ];

  getPeople() {
    return {
      followers: this.followers,
      following: this.following,
      suggestions: this.suggestions,
    }[this.activeTab];
  }

  toggleStatus(person: any) {
    if (this.activeTab === 'followers') {
      person.status = person.status === 'Follow back' ? 'Following' : 'Follow back';
    } else if (this.activeTab === 'following') {
      person.status = person.status === 'Unfollow' ? 'Following' : 'Unfollow';
    } else if (this.activeTab === 'suggestions') {
      person.status = person.status === 'Connect' ? 'Disconnect' : 'Connect';
    }
  }
}

