// d:\programing\Graduation project IT\Angular js\Markting_Web\src\app\components\setting\setting.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent {
  activeSection: string = 'profile';
  
  // Profile Settings
  profileSettings = {
    fullName: '',
    username: '',
    email: '',
    bio: '',
    profilePicture: null as File | null
  };

  // Account Settings
  accountSettings = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false
  };

  // Notification Preferences
  notificationSettings = {
    email: {
      comments: true,
      likes: true,
      newFollowers: false
    },
    push: {
      messages: true,
      updates: false
    }
  };

  // Privacy Controls
  privacySettings = {
    profileVisibility: 'friends',
    postPrivacy: {
      whoCanSee: 'friends',
      whoCanComment: 'everyone'
    },
    dataSharing: false
  };

  // Methods to handle settings
  setActiveSection(section: string) {
    this.activeSection = section;
  }

  onProfilePictureChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileSettings.profilePicture = file;
      // Implement preview logic if needed
    }
  }

  saveProfileSettings() {
    console.log('Saving Profile Settings', this.profileSettings);
    // Implement actual save logic
  }

  saveAccountSettings() {
    // Validate password match
    if (this.accountSettings.newPassword !== this.accountSettings.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Saving Account Settings', this.accountSettings);
    // Implement actual save logic
  }

  saveNotificationSettings() {
    console.log('Saving Notification Settings', this.notificationSettings);
    // Implement actual save logic
  }

  savePrivacySettings() {
    console.log('Saving Privacy Settings', this.privacySettings);
    // Implement actual save logic
  }
}