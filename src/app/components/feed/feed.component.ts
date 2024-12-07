import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileSidebarComponent } from "../profile-sidebar/profile-sidebar.component";

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfileSidebarComponent],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
  providers: [DatePipe]
})
export class FeedComponent {
  // Profile image URL and dropdown visibility
  profileImageUrl = 'https://randomuser.me/api/portraits/men/1.jpg'; // Sample image URL
  isDropdownVisible = false; // Control the dropdown visibility

  // Toggle the visibility of the dropdown menu
  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  posts = [
    {
      username: 'Taha Mahmoud Ahmed',
      profileImageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      timestamp: new Date(),
      content: 'This is a sample post content!',
      imageUrl: 'images/post-image-1.png',
      likes: 15,
      showComments: false,
      isEditing: false,
      isLiked: false,
      comments: [
        { username: 'Jane', text: 'Great post!' },
        { username: 'Mike', text: 'Interesting thoughts.' }
      ]
    },
    {
      username: 'Sara Smith',
      profileImageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      timestamp: new Date(),
      content: 'Another post with no image!',
      imageUrl: 'images/post-image-3.png',
      likes: 8,
      showComments: true,
      isEditing: true,
      isLiked: true,
      comments: [
        { username: 'Tom', text: 'Nice one!' },
        { username: 'Emma', text: 'Very inspiring.' }
      ]
    },
    {
      username: 'rashwan mahmoud',
      profileImageUrl: 'https://randomuser.me/api/portraits/wome',
      timestamp: new Date(),
      content: 'Another post with no image!',
      imageUrl: '',
      likes: 8,
      showComments: false,
      isEditing: false,
      isLiked: false,
      comments: [
        { username: 'Tom', text: 'Nice one!' },
        { username: 'Emma', text: 'Very inspiring.' }
      ]
    }
  ];

  newComment: string = '';  // Define the newComment property

  // Like a post
  likePost(post: any) {
    if (post.isLiked) {
      post.likes--;
    } else {
      post.likes++;
    }
    post.isLiked = !post.isLiked;
  }

  toggleComments(post: any) {
    post.showComments = !post.showComments;
  }

  sharePost(post: any) {
    alert('Post shared!');
  }

  // Toggle Edit mode
  toggleEdit(post: any) {
    post.isEditing = !post.isEditing;
  }

  // Save the edited post content
  savePost(post: any) {
    post.isEditing = false;
  }

  // Add a comment to a post
  addComment(post: any, commentText: string) {
    if (commentText) {
      post.comments.push({ username: 'New User', text: commentText });
      this.newComment = ''; // Clear the input after posting the comment
    }
  }
}
