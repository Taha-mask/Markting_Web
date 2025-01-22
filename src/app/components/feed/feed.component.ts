import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from '../profile/profile.component';
import { User } from '../../user';
import { TrendingSidebarComponent } from "../trending-sidebar/trending-sidebar.component";

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, TrendingSidebarComponent],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
  providers: [DatePipe],
})
export class FeedComponent {
  profileImageUrl = 'https://randomuser.me/api/portraits/men/1.jpg'; // Sample profile image
  isDropdownVisible = false; // Control dropdown visibility
  newComment: string = ''; // Input for comments
  postContent: string = ''; // Input for new post content

  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;

  users = [
    { name: 'Angel', image:'https://images.deepai.org/art-image/d88e01d440b64c36962339af16625162/girl-is-a-mix-between-korean-and-egyptian-28c5a5.jpg' },
    { name: 'Arlene', image: 'images/5e6501a0-f969-45e6-9600-413edd76a9f4.jpg' },
    { name: 'Aubrey', image: 'images/0ef442a5-9622-4c64-af78-d6e557723ec9.jpg' },
    { name: 'Mitchell', image: 'https://images.deepai.org/art-image/a769515ed5a643ba96cbb3d5a9f24eba/girl-is-a-mix-between-korean-and-egyptian-fcbde4.jpg' },
    { name: 'Eduardo', image: 'images/user-2.png' },
    { name: 'Darrell', image: 'images/user-3.png' },
    { name: 'Camer', image: 'images/user-4.png' },
    { name: 'Angel', image: 'images/user-1.png' },
    { name: 'Arlene', image: 'images/5e6501a0-f969-45e6-9600-413edd76a9f4.jpg' },
    { name: 'Aubrey', image: 'images/0ef442a5-9622-4c64-af78-d6e557723ec9.jpg' },
    { name: 'Mitchell', image: 'images/user-1.png' },
    { name: 'Eduardo', image: 'images/user-2.png' },
    { name: 'Darrell', image: 'images/user-3.png' },
    { name: 'Camer', image: 'images/user-4.png' }
  ];


  usersFol = [
    { name: 'Wade Warren', location: 'Assiut, Egypt' },
    { name: 'Darlene Robertson', location: 'Assiut, Egypt' },
    { name: 'Floyd Miles', location: 'Assiut, Egypt' },
    { name: 'Bessie Cooper', location: 'Assiut, Egypt' },
    { name: 'Savannah Nguyen', location: 'Assiut, Egypt' },
    { name: 'Courtney Henry', location: 'Assiut, Egypt' },
    { name: 'Brooklyn Simmons', location: 'Assiut, Egypt' },
    { name: 'Jacob Jones', location: 'Assiut, Egypt' },
  ];

  followUser(user: any) {
    alert(`You followed ${user.name}`);
  }
  user: User[] = [
    {
      username: 'Taha Mahmoud ',
      type: 'Markter',
      profileImageUrl: 'images/user-1.png'
    }
  ];

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
      liked: false,
      saved: false,
      comments: [
        { username: 'Jane', text: 'Great post!' },
        { username: 'Mike', text: 'Interesting thoughts.' },
      ],
    },
    {
      username: 'Sara Smith',
      profileImageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      timestamp: new Date(),
      content: 'Another post with no image!',
      imageUrl: 'images/post-image-3.png',
      likes: 8,
      showComments: false,
      isEditing: false,
      liked: false,
      saved: false,
      comments: [
        { username: 'Tom', text: 'Nice one!' },
        { username: 'Emma', text: 'Very inspiring.' },
      ],
    },
    {
      username: 'Rashwan Mahmoud',
      profileImageUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
      timestamp: new Date(),
      content: 'Another post with no image!',
      imageUrl: '',
      likes: 8,
      showComments: false,
      isEditing: false,
      liked: false,
      saved: false,
      comments: [
        { username: 'Tom', text: 'Nice one!' },
        { username: 'Emma', text: 'Very inspiring.' },
      ],
    },
  ];

  // Toggle dropdown menu
  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  // Like a post
  likePost(post: any) {
    if (post.isLiked) {
      post.likes--;
    } else {
      post.likes++;
    }
    post.isLiked = !post.isLiked;
  }

  // Toggle comments visibility
  toggleComments(post: any) {
    post.showComments = !post.showComments;
  }

  // Share a post
  sharePost(post: any) {
    alert('Post shared!');
  }

  // Toggle edit mode
  toggleEdit(post: any) {
    post.isEditing = !post.isEditing;
  }

  // Save edited post
  savePost(post: any) {
    post.isEditing = false;
  }

  // Add a comment to a post
  addComment(post: any, commentText: string) {
    if (commentText.trim()) {
      post.comments.push({ username: 'Current User', text: commentText });
      this.newComment = ''; // Clear input field
    }
  }

  // Add a new post
  addPost() {
    if (this.postContent.trim()) {
      const newPost = {
        username: 'Current User', // Sample current user
        profileImageUrl: this.profileImageUrl, // User's profile picture
        timestamp: new Date(),
        content: this.postContent,
        imageUrl: '', // No image for simplicity
        likes: 0,
        showComments: false,
        isEditing: false,
        liked: false,
        saved: false,
        comments: [],
      };
      this.posts.unshift(newPost); // Add new post to the top
      this.postContent = ''; // Clear input field
    }
  }

  onScroll(event: WheelEvent) {
    const container = event.currentTarget as HTMLElement;
    container.scrollLeft += event.deltaY;
  }

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.pageX - (event.currentTarget as HTMLElement).offsetLeft;
    this.scrollLeft = (event.currentTarget as HTMLElement).scrollLeft;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.pageX - (event.currentTarget as HTMLElement).offsetLeft;
    const walk = (x - this.startX) * 2; // Scroll-fast
    (event.currentTarget as HTMLElement).scrollLeft = this.scrollLeft - walk;
  }

  onMouseUp() {
    this.isDragging = false;
  }

  toggleLike(post: any) {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
  }

  toggleSave(post: any) {
    post.saved = !post.saved;
  }
}
