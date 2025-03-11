import { Component, HostListener, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { PostService } from '../services/post.service';
import { User } from '../../user';
import { TrendingSidebarComponent } from '../trending-sidebar/trending-sidebar.component';
@Component({
  selector: 'app-explorepage',
  standalone: true,
  imports: [CommonModule, FormsModule, PickerModule, TrendingSidebarComponent],
  templateUrl: './explorepage.component.html',
  styleUrl: './explorepage.component.css'
})
export class ExplorepageComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  isDropdownVisible = false;
  newComment: string = '';
  newCommentImageUrl: string | ArrayBuffer | null = null;
  postContent: string = '';
  currentUser = 'Taha Mahmoud';
  showEmojiPicker = false;
  activeCategory: string = 'All';
  constructor(private postService: PostService) {} // حقن الـ Service
  ngOnInit() {
    // الاشتراك في الـ Observable علشان نستقبل البوستات الجديدة
    this.postService.getPostObservable().subscribe((newPost) => {
      this.posts.unshift(newPost); // إضافة البوست الجديد في بداية المصفوفة
    });

    // Set default category to 'All'
    this.filterPostsByCategory('All');
  }
  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;

  follow(post:any){
    console.log(`${post.username} followed`);
    alert(`${post.username} followed`)
  }
  user: User[] = [
    {

      username: 'Taha Mahmoud ',
      type: 'Markter',
      profileImageUrl: 'images/user-1.png',
      status: 'Online',
    }
  ];




  categories = [
    { name: 'All', icon: 'bi bi-collection' }, // الكل
    { name: 'Electrical Tools', icon: 'bi bi-tools' }, // الأدوات الكهربائية
    { name: 'Food', icon: 'bi bi-egg-fried' }, // أكلات
    { name: 'Medicines', icon: 'bi bi-capsule' }, // الأدوية
    { name: 'Electronics', icon: 'bi bi-laptop' }, // الإلكترونيات
    { name: 'Clothing', icon: 'bi bi-person' }, // الملابس (تم تغيير الأيقونة إلى bi-person)
    { name: 'Fashion', icon: 'bi bi-handbag' }, // الموضة
    { name: 'Home & Kitchen', icon: 'bi bi-house-door' }, // المنزل والمطبخ
    { name: 'Beauty & Personal Care', icon: 'bi bi-scissors' }, // الجمال والعناية الشخصية
    { name: 'Home Appliances', icon: 'bi bi-fan' }, // الأجهزة المنزلية
    { name: 'Sports & Fitness', icon: 'bi bi-bicycle' }, // الرياضة واللياقة البدنية
    { name: 'Video Games', icon: 'bi bi-controller' }, // ألعاب الفيديو
    { name: 'Toys & Hobbies', icon: 'bi bi-joystick' }, // الألعاب والهوايات
    { name: 'Auto Parts', icon: 'bi bi-car-front' }, // قطع الغيار السيارات والدراجات النارية
    { name: 'Groceries', icon: 'bi bi-cart' }, // البقالة والمنتجات الغذائية
    { name: 'Health & Personal Care', icon: 'bi bi-heart-pulse' }, // الصحة والعناية الشخصية
    { name: 'Books & Media', icon: 'bi bi-book' }, // الكتب والوسائط
    { name: 'Pet Supplies', icon: 'bi bi-heart' }, // مستلزمات الحيوانات الأليفة
    { name: 'Perfumes', icon: 'bi bi-flower1' }, // العطور
  ];

  // دالة لتنسيق اسم الفئة
  formatCategoryName(name: string): string {
    return name.replace('&', '<br>&');
  }


  suggestedUsers = [
    { name: 'Alex James', profilePicture: 'images/user-3.png', following: false },
    { name: 'Maicel David', profilePicture: 'images/0ef442a5-9622-4c64-af78-d6e557723ec9.jpg', following: false },
    { name: 'Wade Warren', profilePicture: 'images/0ef442a5-9622-4c64-af78-d6e557723ec9.jpg', following: false },
    { name: 'Floyd Miles', profilePicture: 'images/user-4.png', following: false },
    { name: 'Jacob Jones', profilePicture: 'images/user-1.png', following: false },
    { name: 'Noah Daniel', profilePicture: 'images/0ef442a5-9622-4c64-af78-d6e557723ec9.jpg', following: false },
    { name: 'Bessie Cooper', profilePicture: 'images/5e6501a0-f969-45e6-9600-413edd76a9f4.jpg', following: false },
    { name: 'Brooklyn Simmons', profilePicture: 'https://images.deepai.org/art-image/d88e01d440b64c36962339af16625162/girl-is-a-mix-between-korean-and-egyptian-28c5a5.jpg', following: false },
    { name: 'Courtney Henry', profilePicture: 'https://images.deepai.org/art-image/a769515ed5a643ba96cbb3d5a9f24eba/girl-is-a-mix-between-korean-and-egyptian-fcbde4.jpg', following: false },
    { name:'Savannah Nguyen' , profilePicture: 'images/user-2.png', following: false }

  ];

  usersFol = [
    { name: 'Wade Warren', location: 'Assiut, Egypt', img: 'images/user-1.png', Follow: false },
    { name: 'Darlene Robertson', location: 'Assiut, Egypt', img: 'https://images.deepai.org/art-image/d88e01d440b64c36962339af16625162/girl-is-a-mix-between-korean-and-egyptian-28c5a5.jpg', Follow: false },
    { name: 'Floyd Miles', location: 'Assiut, Egypt', img: 'images/5e6501a0-f969-45e6-9600-413edd76a9f4.jpg', Follow: false },
    { name: 'Bessie Cooper', location: 'Assiut, Egypt', img: 'images/0ef442a5-9622-4c64-af78-d6e557723ec9.jpg', Follow: false },
    { name: 'Savannah Nguyen', location: 'Assiut, Egypt', img: 'images/user-2.png', Follow: false },
    { name: 'Courtney Henry', location: 'Assiut, Egypt', img: 'images/user-3.png', Follow: false },
    { name: 'Brooklyn Simmons', location: 'Assiut, Egypt', img: 'images/user-4.png', Follow: false },
    { name: 'Jacob Jones', location: 'Assiut, Egypt', img: 'images/user-1.png', Follow: false },
  ];

  followUser(user: any) {
    user.Follow = !user.Follow;
  }

  filteredPosts: any[] = [];

  // دالة لتصفية المنشورات بناءً على الفئة
  filterPostsByCategory(categoryName: string) {
    this.activeCategory = categoryName; // تعيين الفئة النشطة
    if (categoryName === 'All') {
      this.filteredPosts = this.posts; // عرض جميع المنشورات إذا كانت الفئة "All"
    } else {
      this.filteredPosts = this.posts.filter(post => post.category === categoryName);
    }
  }
  posts = [
    {
      username: 'Taha Mahmoud',
      profileImageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      timestamp: new Date(),
      content: 'This is a sample post content about electronics!',
      category: 'Electronics',
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
      content: 'Another post about food!',
      category: 'Food',
      images: [
        'images/post-image-4.png',
        'images/post-image-5.png',
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
      content: 'Post about sports and fitness!',
      category: 'Sports & Fitness',
      images: [
        'images/post-image-6.png',
      ],
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
    {
      username: 'Alex James',
      profileImageUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
      timestamp: new Date(),
      content: 'Post about beauty and personal care!',
      category: 'Beauty & Personal Care',
      images: [
        'images/post-image-7.png',
      ],
      currentImageIndex: 0,
      likes: 12,
      Shares: 10,
      Saves: 3,
      showComments: false,
      isEditing: false,
      liked: false,
      saved: false,
      comments: [
        { username: 'Anna', text: 'Lovely!', likes: 3, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/women/5.jpg' },
        { username: 'John', text: 'Great tips.', likes: 1, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/men/6.jpg' },
      ],
    },
    {
      username: 'Emily Clark',
      profileImageUrl: 'https://randomuser.me/api/portraits/women/6.jpg',
      timestamp: new Date(),
      content: 'Post about home appliances!',
      category: 'Home Appliances',
      images: [
        'images/post-image-8.png',
      ],
      currentImageIndex: 0,
      likes: 20,
      Shares: 25,
      Saves: 10,
      showComments: false,
      isEditing: false,
      liked: false,
      saved: false,
      comments: [
        { username: 'Chris', text: 'Very useful!', likes: 5, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/men/7.jpg' },
        { username: 'Sophia', text: 'Thanks for sharing.', likes: 2, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/women/8.jpg' },
      ],
    },
    {
      username: 'John Doe',
      profileImageUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
      timestamp: new Date(),
      content: 'Post about clothing and fashion!',
      category: 'Clothing',
      images: [
        'images/post-image-9.png',
      ],
      currentImageIndex: 0,
      likes: 10,
      Shares: 15,
      Saves: 2,
      showComments: false,
      isEditing: false,
      liked: false,
      saved: false,
      comments: [
        { username: 'Alice', text: 'Nice outfit!', likes: 1, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/women/9.jpg' },
        { username: 'Bob', text: 'Looking good!', likes: 0, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/men/10.jpg' },
      ],
    },
    {
      username: 'Jane Doe',
      profileImageUrl: 'https://randomuser.me/api/portraits/women/7.jpg',
      timestamp: new Date(),
      content: 'Post about video games!',
      category: 'Video Games',
      images: [
        'images/post-image-10.png',
      ],
      currentImageIndex: 0,
      likes: 18,
      Shares: 22,
      Saves: 6,
      showComments: false,
      isEditing: false,
      liked: false,
      saved: false,
      comments: [
        { username: 'Charlie', text: 'Awesome game!', likes: 2, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/men/11.jpg' },
        { username: 'Diana', text: 'I love this game!', likes: 1, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/women/12.jpg' },
      ],
    },
    {
      username: 'Michael Brown',
      profileImageUrl: 'https://randomuser.me/api/portraits/men/6.jpg',
      timestamp: new Date(),
      content: 'Post about groceries!',
      category: 'Groceries',
      images: [
        'images/post-image-11.png',
      ],
      currentImageIndex: 0,
      likes: 7,
      Shares: 12,
      Saves: 4,
      showComments: false,
      isEditing: false,
      liked: false,
      saved: false,
      comments: [
        { username: 'Eva', text: 'Great deals!', likes: 1, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/women/13.jpg' },
        { username: 'Frank', text: 'Thanks for sharing!', likes: 0, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/men/14.jpg' },
      ],
    },
    {
      username: 'Sophia White',
      profileImageUrl: 'https://randomuser.me/api/portraits/women/8.jpg',
      timestamp: new Date(),
      content: 'Post about health and personal care!',
      category: 'Health & Personal Care',
      images: [
        'images/post-image-12.png',
      ],
      currentImageIndex: 0,
      likes: 14,
      Shares: 18,
      Saves: 5,
      showComments: false,
      isEditing: false,
      liked: false,
      saved: false,
      comments: [
        { username: 'George', text: 'Very helpful!', likes: 3, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/men/15.jpg' },
        { username: 'Hannah', text: 'Great advice!', likes: 1, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/women/16.jpg' },
      ],
    },
    {
      username: 'Oliver Green',
      profileImageUrl: 'https://randomuser.me/api/portraits/men/7.jpg',
      timestamp: new Date(),
      content: 'Post about books and media!',
      category: 'Books & Media',
      images: [
        'images/post-image-13.png',
      ],
      currentImageIndex: 0,
      likes: 9,
      Shares: 11,
      Saves: 3,
      showComments: false,
      isEditing: false,
      liked: false,
      saved: false,
      comments: [
        { username: 'Isabella', text: 'Great book!', likes: 2, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/women/17.jpg' },
        { username: 'Jack', text: 'I enjoyed reading it!', likes: 1, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/men/18.jpg' },
      ],
    },
    {
      username: 'Emma Black',
      profileImageUrl: 'https://randomuser.me/api/portraits/women/9.jpg',
      timestamp: new Date(),
      content: 'Post about pet supplies!',
      category: 'Pet Supplies',
      images: [
        'images/post-image-14.png',
      ],
      currentImageIndex: 0,
      likes: 11,
      Shares: 14,
      Saves: 4,
      showComments: false,
      isEditing: false,
      liked: false,
      saved: false,
      comments: [
        { username: 'Kevin', text: 'My pet loves this!', likes: 2, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/men/19.jpg' },
        { username: 'Laura', text: 'Great product!', likes: 1, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/women/20.jpg' },
      ],
    },
    {
      username: 'Liam Brown',
      profileImageUrl: 'https://randomuser.me/api/portraits/men/8.jpg',
      timestamp: new Date(),
      content: 'Post about perfumes!',
      category: 'Perfumes',
      images: [

      ],
      currentImageIndex: 0,
      likes: 13,
      Shares: 17,
      Saves: 6,
      showComments: false,
      isEditing: false,
      liked: false,
      saved: false,
      comments: [
        { username: 'Mia', text: 'Lovely scent!', likes: 3, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/women/21.jpg' },
        { username: 'Noah', text: 'Great choice!', likes: 1, likedBy: [], timestamp: new Date(), profileImageUrl: 'https://randomuser.me/api/portraits/men/22.jpg' },
      ],
    },
  ];
  addNewPost(newPost: any) {
    this.posts.unshift(newPost); // إضافة البوست الجديد في بداية المصفوفة
  }
  // Toggle dropdown menu
  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
 addFriend(user: any) {
    console.log('Friend request sent to', user.name);
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
        username: this.user[0].username, // Sample current user
        profileImageUrl: this.user[0].profileImageUrl, // User's profile picture
        timestamp: new Date(),
        content: this.postContent,
        category: 'General', // Add a default category
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

  toggleFollow(post: any) {
    post.following = !post.following;
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

  deleteUser(user: any) {
    this.suggestedUsers = this.suggestedUsers.filter(u => u !== user);
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
