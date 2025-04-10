import { Component, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PostService, Post } from './components/services/post.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  postContent: string = '';
  selectedFile: File | null = null;
  selectedImageUrl: string = '';
  showEmojiPicker: boolean = false;
  activeCategory: string = 'All';
  activeSubCategory: string = '';
  user = {
    username: 'Taha Mahmoud',
    profileImageUrl: 'assets/images/profile.jpg'
  };

  constructor(private postService: PostService) {}

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    this.postContent = `${this.postContent}${event.emoji.native}`;
    this.showEmojiPicker = false;
  }

  triggerFileInput() {
    const fileInput = document.querySelector('#fileInput') as HTMLElement;
    fileInput.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.selectedImageUrl = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  addPost() {
    if (this.postContent.trim()) {
      const newPost: Post = {
        username: this.user.username,
        profileImageUrl: this.user.profileImageUrl,
        timestamp: new Date(),
        content: this.postContent,
        category: this.activeCategory,
        subCategory: this.activeSubCategory,
        images: this.selectedImageUrl ? [this.selectedImageUrl] : [],
        currentImageIndex: 0,
        likes: 0,
        Shares: 0,
        Saves: 0,
        showComments: false,
        isEditing: false,
        liked: false,
        saved: false,
        isFollowing: false,
        comments: []
      };

      this.postService.addPost(newPost);
      this.resetForm();
    }
  }

  private resetForm() {
    this.postContent = '';
    this.selectedFile = null;
    this.selectedImageUrl = '';
    this.showEmojiPicker = false;
  }
}
