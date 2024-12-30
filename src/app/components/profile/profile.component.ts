import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
import { User } from '../../user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  users = [
    { imageUrl: 'images/WhatsApp Image 2024-11-19 at 06.28.34_f5d6e241.jpg' },
    { imageUrl: 'images/5e6501a0-f969-45e6-9600-413edd76a9f4.jpg' },
    { imageUrl: 'images/0ef442a5-9622-4c64-af78-d6e557723ec9.jpg' },
    { imageUrl: 'images/dabe49c2-2037-4968-ab78-78f2d9341d1f.jpg' },
    { imageUrl: 'images/f983f47c-90a7-415f-bcfd-bb489ab674b7.jpg' },
    { imageUrl: 'images/user-3.png' }, // الصور الإضافية
  ];

  // دالة عرض المزيد (اختياري)
  viewMore() {
    alert('View more users!');
  }


  user: User[] = [
    {
      username: 'Taha Mahmoud Ahmed',
      type: 'Markter',
      profileImageUrl: 'images/user-1.png'
    }];

  profileImageUrl = 'https://randomuser.me/api/portraits/men/1.jpg'; // Sample profile image
  isDropdownVisible = false; // Control dropdown visibility
  newComment: string = ''; // Input for comments
  postContent: string = ''; // Input for new post content
  bio: string = '';
  isEditingBio: boolean = true; // Initially true to show textarea

  address: string = 'Al-Medan Store';
  location: string = 'Egypt, Assiut';
  phoneNumber: string = '01120927249';
  email: string = 'taha.mahmoud.enggmail.com';

  isEditingAddress: boolean = false;
  isEditingLocation: boolean = false;
  isEditingPhoneNumber: boolean = false;
  isEditingEmail: boolean = false;

  rating: number = 4.5; // التقييم
  totalViews: number = 150; // عدد المشاهدات

  // إنشاء مصفوفة للنجوم
  get fullStars(): number[] {
    return Array(Math.floor(this.rating)).fill(0); // نجوم ممتلئة
  }

  get hasHalfStar(): boolean {
    return this.rating % 1 !== 0; // نجم نصف
  }

  get emptyStars(): number[] {
    return Array(5 - Math.ceil(this.rating)).fill(0); // نجوم فارغة
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
      isLiked: false,
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
      isLiked: false,
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
      post.comments.push({ username: 'New User', text: commentText });
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
        isLiked: false,
        comments: [],
      };
      this.posts.unshift(newPost); // Add new post to the top
      this.postContent = ''; // Clear input field
    }
  }

  toggleEditBio() {
    this.isEditingBio = !this.isEditingBio;
  }

  saveBio(newBio: string) {
    if (newBio.trim()) {
      this.bio = newBio;
      this.isEditingBio = false;
    }
  }

  toggleEditAddress() {
    this.isEditingAddress = !this.isEditingAddress;
  }

  toggleEditLocation() {
    this.isEditingLocation = !this.isEditingLocation;
  }

  toggleEditPhoneNumber() {
    this.isEditingPhoneNumber = !this.isEditingPhoneNumber;
  }

  toggleEditEmail() {
    this.isEditingEmail = !this.isEditingEmail;
  }

  saveAddress(newAddress: string) {
    if (newAddress.trim()) {

      this.address = newAddress;
      this.isEditingAddress = false;
    }
  }

  saveLocation(newLocation: string) {
    if (newLocation.trim()) {
      this.location = newLocation;
      this.isEditingLocation = false;
    }
  }

  savePhoneNumber(newPhoneNumber: string) {
    if (newPhoneNumber.trim()) {
      this.phoneNumber = newPhoneNumber;
      this.isEditingPhoneNumber = false;
    }
  }

  saveEmail(newEmail: string) {
    if (newEmail.trim()) {
      this.email = newEmail;
      this.isEditingEmail = false;
    }
  }
}
