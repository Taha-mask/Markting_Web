import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from '../profile/profile.component';
import { User } from '../../user';
import { Comment as ImportedComment } from '../../Comment';
import { TrendingSidebarComponent } from "../trending-sidebar/trending-sidebar.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { PickerModule } from '@ctrl/ngx-emoji-mart'; // استورد PickerModule

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, TrendingSidebarComponent, PickerModule],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
  providers: [DatePipe],
})
export class FeedComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  profileImageUrl = 'https://randomuser.me/api/portraits/men/1.jpg'; // Sample profile image
  isDropdownVisible = false; // Control dropdown visibility
  newComment: string = ''; // Input for comments
  newCommentImageUrl: string | ArrayBuffer | null = null; // Store the selected image URL
  postContent: string = ''; // Input for new post content
  currentUser = 'Taha Mahmoud'; // المستخدم الحالي
  showEmojiPicker = false; // Add this property

  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;

  user: User[] = [
    {
      username: 'Taha Mahmoud ',
      type: 'Markter',
      profileImageUrl: 'images/user-1.png',
      status: 'Online',
    }
  ];

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
    { name: 'Wade Warren', location: 'Assiut, Egypt', img: 'images/user-1.png' },
    { name: 'Darlene Robertson', location: 'Assiut, Egypt', img: 'https://images.deepai.org/art-image/d88e01d440b64c36962339af16625162/girl-is-a-mix-between-korean-and-egyptian-28c5a5.jpg' },
    { name: 'Floyd Miles', location: 'Assiut, Egypt', img: 'images/5e6501a0-f969-45e6-9600-413edd76a9f4.jpg'  },
    { name: 'Bessie Cooper', location: 'Assiut, Egypt' , img: 'images/0ef442a5-9622-4c64-af78-d6e557723ec9.jpg' },
    { name: 'Savannah Nguyen', location: 'Assiut, Egypt', img: 'images/user-2.png'  },
    { name: 'Courtney Henry', location: 'Assiut, Egypt' , img: 'images/user-3.png' },
    { name: 'Brooklyn Simmons', location: 'Assiut, Egypt', img: 'images/user-4.png'  },
    { name: 'Jacob Jones', location: 'Assiut, Egypt', img: 'images/user-1.png'  },
  ];

  followUser(user: any) {
    alert(`You followed ${user.name}`);
  }



  posts = [
    {
      username: 'Taha Mahmoud',
      profileImageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      timestamp: new Date(),
      content: 'This is a sample post content!',
      images: [
        'images/post-image-1.png',
        'images/post-image-2.png',
        'images/post-image-3.png',
      ],
      currentImageIndex: 0, // تتبع الصورة الحالية
      likes: 15,
      Shares: 30,
      Saves: 5,
      showComments: false,
      isEditing: false,
      liked: false,
      Saved: false,
      comments: [
        { username: 'Jane', text: 'Great post!', likes: 2, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/women/1.jpg' },
        { username: 'Mike', text: 'Interesting thoughts.', likes: 0, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/men/2.jpg' },
      ],
    },
    {
      username: 'Sara Smith',
      profileImageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      timestamp: new Date(),
      content: 'Another post with no image!',
      images: [
        'images/post-image-3.png',
        'images/post-image-4.png',
      ],
      currentImageIndex: 0,
      likes: 8,
      Shares: 165,
      Saves: 20,
      showComments: false,
      isEditing: false,
      liked: false,
      Saved: false,
      comments: [
        { username: 'Tom', text: 'Nice one!', likes: 1, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/men/3.jpg' },
        { username: 'Emma', text: 'Very inspiring.', likes: 0, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/women/4.jpg' },
      ],
    },
    {
      username: 'Rashwan Mahmoud',
      profileImageUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
      timestamp: new Date(),
      content: 'Another post with no image!',
      images: [],
      currentImageIndex: 0,
      likes: 8,
      Shares: 5,
      Saves: 7,
      showComments: false,
      isEditing: false,
      liked: false,
      saved: false,
      comments: [
        { username: 'Tom', text: 'Nice one!', likes: 1, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/men/3.jpg' },
        { username: 'Emma', text: 'Very inspiring.', likes: 0, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/women/4.jpg' },
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

  // Method to toggle the emoji picker
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  // Method to add emoji to the comment
  addEmoji(event: any) {
    this.newComment += event.emoji.native;
  }

  // Method to trigger file input click
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  // Method to handle file selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.newCommentImageUrl = e.target?.result ?? null;
      };
      reader.readAsDataURL(file);
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
        images: [], // No images for simplicity
        currentImageIndex: 0,
        likes: 0,
        Shares: 0,
        Saves: 0,
        showComments: false,
        isEditing: false,
        liked: false,
        Saved: false,
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
    post.Saves += post.saved ? 1 : -1;
  }

  // التنقل إلى الصورة التالية
  nextImage(post: any) {
    if (post.currentImageIndex < post.images.length - 1) {
      post.currentImageIndex++;
    }
  }

  // التنقل إلى الصورة السابقة
  prevImage(post: any) {
    if (post.currentImageIndex > 0) {
      post.currentImageIndex--;
    }
  }

  // دالة لحذف التعليق
  deleteComment(post: any, commentIndex: number) {
    if (post.comments[commentIndex].username === this.currentUser) {
      post.comments.splice(commentIndex, 1);
    } else {
      alert('You can only delete your own comments.');
    }
  }

  // دالة لتعديل التعليق
  editComment(post: any, comment: any) {
    const newCommentText = prompt('Edit your comment:', comment.text);
    if (newCommentText !== null) {
      comment.text = newCommentText;
    }
  }

  // دالة لإضافة تعليق جديد
  addComment(post: any, commentText: string): void {
    if (commentText.trim() || this.newCommentImageUrl) {
      post.comments.push({
        username: this.currentUser,
        text: commentText,
        imageUrl: this.newCommentImageUrl,
        likes: 0,
        likedBy: [],
        timestamp: new Date(),
        profileImageUrl: this.user[0].profileImageUrl
      });
      this.newComment = '';
      this.newCommentImageUrl = null;
    }
  }

  // دالة لإضافة تفاعل (إعجاب) على التعليق
  toggleCommentLike(comment: any) {
    if (!comment.likes) {
      comment.likes = 0;
    }
    if (!comment.likedBy) {
      comment.likedBy = [];
    }

    if (comment.likedBy.includes(this.currentUser)) {
      comment.likes--;
      comment.likedBy = comment.likedBy.filter((user: string) => user !== this.currentUser);
    } else {
      comment.likes++;
      comment.likedBy.push(this.currentUser);
    }
  }

  // Close emoji picker when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.emoji-picker-container') && !target.closest('.bi-emoji-smile')) {
      this.showEmojiPicker = false;
    }
  }
}

// Define the Comment type with the imageUrl property
export interface LocalComment {
  username: string;
  text: string;
  imageUrl?: string;
  likes: number;
  likedBy: string[];
  timestamp: Date;
  profileImageUrl: string;
}
