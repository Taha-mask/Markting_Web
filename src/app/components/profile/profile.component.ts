import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
import { User } from '../../user';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, PickerModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  isDropdownVisible = false;
  newComment: string = '';
  newCommentImageUrl: string | ArrayBuffer | null = null;
  postContent: string = '';
  currentUser = 'Taha Mahmoud';
  showEmojiPicker = false;
  activeCategory: string = 'All';
  users = [
    { imageUrl: 'images/WhatsApp Image 2024-11-19 at 06.28.34_f5d6e241.jpg' },
    { imageUrl: 'images/5e6501a0-f969-45e6-9600-413edd76a9f4.jpg' },
    { imageUrl: 'images/0ef442a5-9622-4c64-af78-d6e557723ec9.jpg' },
    { imageUrl: 'images/dabe49c2-2037-4968-ab78-78f2d9341d1f.jpg' },
    { imageUrl: 'images/f983f47c-90a7-415f-bcfd-bb489ab674b7.jpg' },
    { imageUrl: 'images/user-3.png' },
  ];

  viewMore() {
    alert('View more users!');
  }

  user: User[] = [
    {
      username: 'Taha Mahmoud Ahmed',
      type: 'Markter',
      profileImageUrl: 'images/user-1.png',
      status: 'online',
    }
  ];

  profileImageUrl = 'https://randomuser.me/api/portraits/men/1.jpg';
  isDragging = false;
  scrollLeft: number = 0;
  startX: number = 0;
  bio: string = '';
  isEditingBio: boolean = true;

  address: string = 'Al-Medan Store';
  location: string = 'Egypt, Assiut';
  phoneNumber: string = '01120927249';
  email: string = 'taha.mahmoud.enggmail.com';

  isEditingAddress: boolean = false;
  isEditingLocation: boolean = false;
  isEditingPhoneNumber: boolean = false;
  isEditingEmail: boolean = false;

  rating: number = 4.5;
  totalViews: number = 150;

  get fullStars(): number[] {
    return Array(Math.floor(this.rating)).fill(0);
  }

  get hasHalfStar(): boolean {
    return this.rating % 1 !== 0;
  }

  get emptyStars(): number[] {
    return Array(5 - Math.ceil(this.rating)).fill(0);
  }

  posts = [
    {
      username: 'Taha Mahmoud Ahmed',
      profileImageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      timestamp: new Date(),
      content: 'This is a sample post content!',
      images: [
        'images/post-image-1.png',
        'images/post-image-2.png',
        'images/post-image-3.png',
      ],
      currentImageIndex: 0,
      likes: 15,
      Shares: 30,
      Saves: 5,
      showComments: false,
      isEditing: false,
      liked: false,
      saved: false,
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

  addEmoji(event: any) {
    this.newComment += event.emoji.native;
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  // Add a comment to a post
  addComment(post: any, commentText: string) {
    if (commentText.trim()) {
      post.comments.push({
        username: this.currentUser,
        text: commentText,
        likes: 0,
        likedBy: [],
        timestamp: new Date(),
        profileImageUrl: this.user[0].profileImageUrl
      });
      this.newComment = ''; // Clear input field
    }
  }

  // Add a new post
  addPost() {
    if (this.postContent.trim()) {
      const newPost = {
        username: this.user[0].username, // Sample current user
        profileImageUrl: this.user[0].profileImageUrl, // User's profile picture
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

  // دالة لتغيير صورة الغلاف
  changeCoverImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          // تغيير صورة الغلاف هنا (يمكنك حفظها في قاعدة البيانات أو تحديث الواجهة)
          const coverImage = document.querySelector('.custom-image') as HTMLImageElement;
          if (coverImage) {
            coverImage.src = reader.result as string;
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  // دالة لتغيير الصورة الدائرية
  changeProfileImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          // تغيير الصورة الدائرية هنا (يمكنك حفظها في قاعدة البيانات أو تحديث الواجهة)
          const profileImage = document.querySelector('.profile-image') as HTMLImageElement;
          if (profileImage) {
            profileImage.src = reader.result as string;
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  onClickOnImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          this.user[0].profileImageUrl = e.target.result as string; // تحديث الصورة
        }
      };
      reader.readAsDataURL(input.files[0]);
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

  // دالة لحذف المنشور
  deletePost(post: any) {
    const index = this.posts.indexOf(post);
    if (index > -1) {
      this.posts.splice(index, 1);
    }
  }

  // دالة للإبلاغ عن المنشور
  reportPost(post: any) {
    alert(`Reported post by ${post.username}`);
  }

  // دالة لإلغاء متابعة المستخدم
  unfollow(post: any) {
    alert(`Unfollowed ${post.username}`);
  }

  // دالة لإخفاء المنشور
  hidePost(post: any) {
    const index = this.posts.indexOf(post);
    if (index > -1) {
      this.posts.splice(index, 1);
    }
  }

  // دالة لإيقاف المستخدم مؤقتًا
  snoozeUser(post: any, days: number) {
    alert(`Snoozed ${post.username} for ${days} days`);
  }

  // دالة لحظر المستخدم
  blockUser(post: any) {
    alert(`Blocked ${post.username}`);
  }
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
}