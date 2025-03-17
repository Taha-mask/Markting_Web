import { Component, HostListener, ViewChild, ElementRef, OnInit, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { RouterModule } from '@angular/router';
import { PostService } from '../services/post.service';
import { TrendingSidebarComponent } from '../trending-sidebar/trending-sidebar.component';
import { User } from '../../interfaces/user';

declare var bootstrap: any;

interface ReactionCount {
  reaction: string;
  count: number;
}

interface ReactionUser {
  username: string;
  profileImageUrl: string;
  reactionType: string;
  timestamp: Date;
}

interface Post {
  id?: string;
  username: string;
  profileImageUrl: string;
  timestamp: Date;
  content: string;
  category: string;
  subCategory?: string;
  images: string[];
  currentImageIndex: number;
  likes: number;
  Shares: number;
  Saves: number;
  showComments: boolean;
  isEditing: boolean;
  liked: boolean;
  saved: boolean;
  comments: Comment[];
  reactions?: { [key: string]: number };
  topReactions?: ReactionCount[];
  reactionUsers?: ReactionUser[];
  isPinned?: boolean;
  showReactionUsers?: boolean;
}

interface Comment {
  id: string;
  username: string;
  text: string;
  imageUrl?: string;
  likes: number;
  likedBy: { username: string; profileImageUrl: string; }[];
  timestamp: Date;
  profileImageUrl: string;
  replies?: Comment[];
  showReplyInput?: boolean;
  parentId?: string;
  replyText?: string;
  showLikedBy?: boolean;
}

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PickerModule, TrendingSidebarComponent],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
  providers: [DatePipe, PostService],
})
export class FeedComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild(TrendingSidebarComponent) trendingSidebar!: TrendingSidebarComponent;
  isDropdownVisible = false;
  newComment: string = '';
  newCommentImageUrl: string | ArrayBuffer | null = null;
  postContent: string = '';
  currentUser = 'Taha Mahmoud';
  showEmojiPicker = false;
  activeCategory: string = 'All';
  navbarVisible = true;
  lastScrollTop = 0;
  isShareModalVisible = false;
  selectedPost: Post | null = null;
  postUrl: string = '';
  linkCopied: boolean = false;
  currentReplyText: string = '';
  constructor(@Inject(PostService) private postService: PostService) {} // حقن الـ Service
  ngOnInit() {
    // الاشتراك في الـ Observable علشان نستقبل البوستات الجديدة
    this.postService.getPostObservable().subscribe((newPost: Post) => {
      this.posts.unshift(newPost); // إضافة البوست الجديد في بداية المصفوفة
    });

    // Set default category to 'All'
    this.filterPostsByCategory('All');
  }
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

  subCategories: any[] = []; // لتخزين الأيقونات الفرعية
  activeSubCategory: string = ''; // لتحديد الأيقونة الفرعية النشطة


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
    { name: 'Alex James', profilePicture: 'images/user-3.png' },
    { name: 'Maicel David', profilePicture: 'images/0ef442a5-9622-4c64-af78-d6e557723ec9.jpg' },
    { name: 'Wade Warren', profilePicture: 'images/0ef442a5-9622-4c64-af78-d6e557723ec9.jpg' },
    { name: 'Floyd Miles', profilePicture: 'images/user-4.png' },
    { name: 'Jacob Jones', profilePicture: 'images/user-1.png' },
    { name: 'Noah Daniel', profilePicture: 'images/0ef442a5-9622-4c64-af78-d6e557723ec9.jpg' },
    { name: 'Bessie Cooper', profilePicture:  'images/5e6501a0-f969-45e6-9600-413edd76a9f4.jpg'  },
    { name: 'Brooklyn Simmons', profilePicture: 'https://images.deepai.org/art-image/d88e01d440b64c36962339af16625162/girl-is-a-mix-between-korean-and-egyptian-28c5a5.jpg'  },
    { name: 'Courtney Henry', profilePicture: 'https://images.deepai.org/art-image/a769515ed5a643ba96cbb3d5a9f24eba/girl-is-a-mix-between-korean-and-egyptian-fcbde4.jpg'  },
    { name:'Savannah Nguyen' , profilePicture: 'images/user-2.png' }

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
    if (user.Follow) {
      this.trendingSidebar.incrementFollowingCount();
    } else {
      this.trendingSidebar.decrementFollowingCount();
    }
  }

  toggleFollow(userFol: any) {
    this.followUser(userFol); // Reuse the followUser method for consistency
  }

  filteredPosts: Post[] = [];

  // دالة لتصفية المنشورات بناءً على الفئة
  filterPostsByCategory(categoryName: string) {
    this.activeCategory = categoryName; // تعيين الفئة النشطة
    if (categoryName === 'All') {
      this.filteredPosts = this.posts; // عرض جميع المنشورات إذا كانت الفئة "All"
    } else {
      this.filteredPosts = this.posts.filter(post => post.category === categoryName);
    }
  }


  filterPostsBySubCategory(subCategoryName: string) {
    this.activeSubCategory = subCategoryName; // تعيين الفئة الفرعية النشطة
    this.filteredPosts = this.posts.filter(post => post.subCategory === subCategoryName);
  }
  posts: Post[] = [
    {
      username: 'Taha Mahmoud',
      profileImageUrl: 'images/user-1.jpg',
      timestamp: new Date(),
      content: 'This is a sample post content about electronics!',
      category: 'Electronics',
      subCategory: 'General',
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
        {
          id: 'comment1',
          username: 'Sarah Johnson',
          text: 'Great post! Very informative.',
          likes: 5,
          likedBy: [
            { username: 'Mike Chen', profileImageUrl: 'images/user-2.jpg' },
            { username: 'Emma Davis', profileImageUrl: 'images/user-3.jpg' }
          ],
          timestamp: new Date(2025, 2, 15, 14, 30),
          profileImageUrl: 'images/user-3.jpg',
          replies: [
            {
              id: 'reply1',
              username: 'Mike Chen',
              text: 'Totally agree! The insights are valuable.',
              likes: 2,
              likedBy: [],
              timestamp: new Date(2025, 2, 15, 15, 0),
              profileImageUrl: 'images/user-2.jpg'
            }
          ]
        }
      ]
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
      saved: false,
      comments: [
        { 
          id: 'comment2',
          username: 'Tom', 
          text: 'Nice one!', 
          likes: 1, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/men/3.jpg' 
        },
        { 
          id: 'comment3',
          username: 'Emma', 
          text: 'Very inspiring.', 
          likes: 0, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/women/4.jpg' 
        },
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
        { 
          id: 'comment4',
          username: 'Tom', 
          text: 'Nice one!', 
          likes: 1, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/men/3.jpg' 
        },
        { 
          id: 'comment5',
          username: 'Emma', 
          text: 'Very inspiring.', 
          likes: 0, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/women/4.jpg' 
        },
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
        { 
          id: 'comment6',
          username: 'Anna', 
          text: 'Lovely!', 
          likes: 3, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/women/5.jpg' 
        },
        { 
          id: 'comment7',
          username: 'John', 
          text: 'Great tips.', 
          likes: 1, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/men/6.jpg' 
        },
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
        { 
          id: 'comment8',
          username: 'Chris', 
          text: 'Very useful!', 
          likes: 5, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/men/7.jpg' 
        },
        { 
          id: 'comment9',
          username: 'Sophia', 
          text: 'Thanks for sharing.', 
          likes: 2, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/women/8.jpg' 
        },
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
        { 
          id: 'comment10',
          username: 'Alice', 
          text: 'Nice outfit!', 
          likes: 1, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/women/9.jpg' 
        },
        { 
          id: 'comment11',
          username: 'Bob', 
          text: 'Looking good!', 
          likes: 0, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/men/10.jpg' 
        },
      ],
    },
    {
      username: 'Jane Doe',
      profileImageUrl: 'https://randomuser.me/api/portraits/women/7.jpg',
      timestamp: new Date(),
      content: 'Post about video games!',
      category: 'Video Games',
      images: [
        'https://s.alicdn.com/@sc04/kf/He134ce4e88ff4f99883e5dcc7b8e280dk.jpg_720x720q50',
        'https://s.alicdn.com/@sc04/kf/H1ee0efef84d747768d35729e69885b9ee.jpg?avif=close',
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
        { 
          id: 'comment12',
          username: 'Charlie', 
          text: 'Awesome game!', 
          likes: 2, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/men/11.jpg' 
        },
        { 
          id: 'comment13',
          username: 'Diana', 
          text: 'I love this game!', 
          likes: 1, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/women/12.jpg' 
        },
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
        { 
          id: 'comment14',
          username: 'Eva', 
          text: 'Great deals!', 
          likes: 1, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/women/13.jpg' 
        },
        { 
          id: 'comment15',
          username: 'Frank', 
          text: 'Thanks for sharing!', 
          likes: 0, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/men/14.jpg' 
        },
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
        { 
          id: 'comment16',
          username: 'George', 
          text: 'Very helpful!', 
          likes: 3, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/men/15.jpg' 
        },
        { 
          id: 'comment17',
          username: 'Hannah', 
          text: 'Great advice!', 
          likes: 1, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/women/16.jpg' 
        },
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
        { 
          id: 'comment18',
          username: 'Isabella', 
          text: 'Great book!', 
          likes: 2, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/women/17.jpg' 
        },
        { 
          id: 'comment19',
          username: 'Jack', 
          text: 'I enjoyed reading it!', 
          likes: 1, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/men/18.jpg' 
        },
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
        { 
          id: 'comment20',
          username: 'Kevin', 
          text: 'My pet loves this!', 
          likes: 2, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/men/19.jpg' 
        },
        { 
          id: 'comment21',
          username: 'Laura', 
          text: 'Great product!', 
          likes: 1, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/women/20.jpg' 
        },
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
        { 
          id: 'comment22',
          username: 'Mia', 
          text: 'Lovely scent!', 
          likes: 3, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/women/21.jpg' 
        },
        { 
          id: 'comment23',
          username: 'Noah', 
          text: 'Great choice!', 
          likes: 1, 
          likedBy: [], 
          timestamp: new Date(), 
          profileImageUrl: 'https://randomuser.me/api/portraits/men/22.jpg' 
        },
      ],
    },
  ];
  addNewPost(newPost: Post) {
    this.posts.unshift(newPost); // إضافة البوست الجديد في بداية المصفوفة
  }
  // Toggle dropdown menu
  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
 addFriend(user: any) {
    console.log('Friend request sent to', user.name);
  }

  // دالة لإخفاء المنشور
hidePost(post: Post) {
  const index = this.filteredPosts.indexOf(post);
  if (index > -1) {
    this.filteredPosts.splice(index, 1);
  }
}

// دالة لإيقاف المستخدم مؤقتًا
snoozeUser(post: Post, days: number) {
  alert(`Snoozed ${post.username} for ${days} days`);
}

// دالة لحظر المستخدم
blockUser(post: Post) {
  alert(`Blocked ${post.username}`);
}
  // Like a post
  likePost(post: Post) {
    if (post.liked) {
      post.likes--;
    } else {
      post.likes++;
    }
    post.liked = !post.liked;
  }

  // Toggle comments visibility
  toggleComments(post: Post) {
    post.showComments = !post.showComments;
  }

  // Share a post
  sharePost(post: Post) {
    this.selectedPost = post;
    const postId = post.id || Date.now().toString();
    this.postUrl = `${window.location.origin}/post/${postId}`;
    const modal = document.getElementById('shareModal');
    if (modal) {
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
    // Increment share count
    post.Shares++;
  }

  // Toggle edit mode
  toggleEdit(post: Post) {
    post.isEditing = !post.isEditing;
  }

  // Save edited post
  savePost(post: Post) {
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
      const newPost: Post = {
        username: this.user[0].username, // Use profile's username
        profileImageUrl: this.user[0].profileImageUrl, // Use profile's profile picture
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
        saved: false,
        comments: [],
      };
      this.posts.unshift(newPost); // Add new post to the top
      this.postContent = ''; // Clear input field
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    const scrollTop = (event as UIEvent).view?.scrollY || document.documentElement.scrollTop;
    if (scrollTop < this.lastScrollTop) {
      this.navbarVisible = false;
    } else {
      this.navbarVisible = true;
    }
    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
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

  toggleLike(post: Post) {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
  }

  toggleSave(post: Post) {
    post.saved = !post.saved;
    post.Saves += post.saved ? 1 : -1;
  }

  // التنقل إلى الصورة التالية
  nextImage(post: Post) {
    if (post.currentImageIndex < post.images.length - 1) {
      post.currentImageIndex++;
    }
  }

  // التنقل إلى الصورة السابقة
  prevImage(post: Post) {
    if (post.currentImageIndex > 0) {
      post.currentImageIndex--;
    }
  }

  // دالة لحذف التعليق
  deleteComment(post: Post, commentIndex: number) {
    if (post.comments[commentIndex].username === this.currentUser) {
      post.comments.splice(commentIndex, 1);
    } else {
      alert('You can only delete your own comments.');
    }
  }

  // دالة لتعديل التعليق
  editComment(post: Post, comment: Comment) {
    const newCommentText = prompt('Edit your comment:', comment.text);
    if (newCommentText !== null) {
      comment.text = newCommentText;
    }
  }

  // دالة لإضافة تعليق جديد
  addComment(post: Post, commentText: string): void {
    if (commentText.trim() || this.newCommentImageUrl) {
      const imageUrl = typeof this.newCommentImageUrl === 'string' ? this.newCommentImageUrl : undefined;
      post.comments.push({
        id: this.generateCommentId(),
        username: this.currentUser,
        text: commentText,
        imageUrl,
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
  toggleCommentLike(comment: Comment) {
    const currentUser = {
      username: this.currentUser,
      profileImageUrl: this.user[0].profileImageUrl
    };

    const userIndex = comment.likedBy.findIndex(user => user.username === currentUser.username);
    if (userIndex === -1) {
      comment.likes++;
      comment.likedBy.push(currentUser);
    } else {
      comment.likes--;
      comment.likedBy.splice(userIndex, 1);
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

  editPost(post: Post) {
    // Logic to edit the post
    post.isEditing = true;
  }

  deletePost(post: Post) {
    // Logic to delete the post
    const index = this.filteredPosts.indexOf(post);
    if (index > -1) {
      this.filteredPosts.splice(index, 1);
    }
  }

  reportPost(post: Post) {
    alert(`Reported post by ${post.username}`);
  }

  unfollow(post: Post) {
    alert(`Unfollowed ${post.username}`);
  }
  goBackToCategories() {
    this.activeCategory = 'All';
    this.activeSubCategory = '';
    this.subCategories = [];
    this.filterPostsByCategory('All');
  }


  showSubCategories(category: any) {
    this.activeCategory = category.name; // تعيين الفئة النشطة
    this.subCategories = this.getSubCategories(category.name); // جلب الأيقونات الفرعية
  }

  getSubCategories(categoryName: string): any[] {
    const subCategories = [
        { name: 'All', icon: 'bi bi-collection' } // Add "All" option to each subcategory list
    ];
    switch (categoryName) {
      case 'Food':
        return subCategories.concat([
          { name: 'Drinks', icon: 'bi bi-cup' },
          { name: 'Candy', icon: 'bi bi-candy' },
          { name: 'Snacks', icon: 'bi bi-basket' },
          { name: 'Desserts', icon: 'bi bi-cake' }
        ]);
      case 'Electronics':
        return subCategories.concat([
          { name: 'Phones', icon: 'bi bi-phone' },
          { name: 'Laptops', icon: 'bi bi-laptop' },
          { name: 'Accessories', icon: 'bi bi-headphones' }
        ]);
      case 'Electrical Tools':
        return subCategories.concat([
          { name: 'Power Tools', icon: 'bi bi-lightning' },
          { name: 'Hand Tools', icon: 'bi bi-wrench' },
          { name: 'Measurement Tools', icon: 'bi bi-ruler' }
        ]);
      case 'Medicines':
        return subCategories.concat([
          { name: 'Prescription', icon: 'bi bi-file-medical' },
          { name: 'Over-the-Counter', icon: 'bi bi-capsule' },
          { name: 'Supplements', icon: 'bi bi-pills' }
        ]);
      case 'Clothing':
        return subCategories.concat([
          { name: 'Men', icon: 'bi bi-person' },
          { name: 'Women', icon: 'bi bi-person-fill' },
          { name: 'Kids', icon: 'bi bi-person-badge' }
        ]);
      case 'Fashion':
        return subCategories.concat([
          { name: 'Accessories', icon: 'bi bi-handbag' },
          { name: 'Jewelry', icon: 'bi bi-gem' },
          { name: 'Shoes', icon: 'bi bi-shoe' }
        ]);
      case 'Home & Kitchen':
        return subCategories.concat([
          { name: 'Furniture', icon: 'bi bi-house' },
          { name: 'Appliances', icon: 'bi bi-fan' },
          { name: 'Decor', icon: 'bi bi-paint-bucket' }
        ]);
      case 'Beauty & Personal Care':
        return subCategories.concat([
          { name: 'Skincare', icon: 'bi bi-droplet' },
          { name: 'Haircare', icon: 'bi bi-scissors' },
          { name: 'Makeup', icon: 'bi bi-brush' }
        ]);
      case 'Home Appliances':
        return subCategories.concat([
          { name: 'Kitchen', icon: 'bi bi-fridge' },
          { name: 'Laundry', icon: 'bi bi-washing-machine' },
          { name: 'Cleaning', icon: 'bi bi-vacuum' }
        ]);
      case 'Sports & Fitness':
        return subCategories.concat([
          { name: 'Equipment', icon: 'bi bi-dumbbell' },
          { name: 'Clothing', icon: 'bi bi-tshirt' },
          { name: 'Accessories', icon: 'bi bi-watch' }
        ]);
      case 'Video Games':
        return subCategories.concat([
          { name: 'Consoles', icon: 'bi bi-controller' },
          { name: 'Games', icon: 'bi bi-gamepad' },
          { name: 'Accessories', icon: 'bi bi-headset' }
        ]);
      case 'Toys & Hobbies':
        return subCategories.concat([
          { name: 'Action Figures', icon: 'bi bi-robot' },
          { name: 'Board Games', icon: 'bi bi-grid' },
          { name: 'Puzzles', icon: 'bi bi-puzzle' }
        ]);
      case 'Auto Parts':
        return subCategories.concat([
          { name: 'Engine', icon: 'bi bi-gear' },
          { name: 'Body', icon: 'bi bi-car-front' },
          { name: 'Interior', icon: 'bi bi-steering-wheel' }
        ]);
      case 'Groceries':
        return subCategories.concat([
          { name: 'Fruits', icon: 'bi bi-apple' },
          { name: 'Vegetables', icon: 'bi bi-carrot' },
          { name: 'Dairy', icon: 'bi bi-milk' }
        ]);
      case 'Health & Personal Care':
        return subCategories.concat([
          { name: 'Medical Supplies', icon: 'bi bi-first-aid' },
          { name: 'Personal Hygiene', icon: 'bi bi-hand-sanitizer' },
          { name: 'Fitness', icon: 'bi bi-heart-pulse' }
        ]);
      case 'Books & Media':
        return subCategories.concat([
          { name: 'Books', icon: 'bi bi-book' },
          { name: 'Magazines', icon: 'bi bi-journal' },
          { name: 'Music', icon: 'bi bi-music-note' }
        ]);
      case 'Pet Supplies':
        return subCategories.concat([
          { name: 'Food', icon: 'bi bi-bone' },
          { name: 'Toys', icon: 'bi bi-ball' },
          { name: 'Grooming', icon: 'bi bi-scissors' }
        ]);
      case 'Perfumes':
        return subCategories.concat([
          { name: 'Men', icon: 'bi bi-bottle' },
          { name: 'Women', icon: 'bi bi-bottle-fill' },
          { name: 'Unisex', icon: 'bi bi-bottle-half' }
        ]);
      default:
        return subCategories;
    }
  }

  // New methods for enhanced post interaction
  pinPost(post: Post) {
    post.isPinned = !post.isPinned;
    if (post.isPinned) {
      // Move post to top of feed
      const index = this.posts.indexOf(post);
      if (index > -1) {
        this.posts.splice(index, 1);
        this.posts.unshift(post);
      }
    }
    this.filterPostsByCategory(this.activeCategory);
  }

  shareViaMessage(post: Post) {
    // Implementation for direct message sharing
    console.log('Sharing via message:', post);
  }

  copyLink(input: HTMLInputElement | Post) {
    if (input instanceof HTMLInputElement) {
      input.select();
      document.execCommand('copy');
      this.linkCopied = true;
      setTimeout(() => {
        this.linkCopied = false;
      }, 2000);
    } else {
      // Handle Post type
      const dummyUrl = `https://yoursite.com/post/${Date.now()}`;
      navigator.clipboard.writeText(dummyUrl);
    }
  }

  // Enhanced post filtering
  filterByTrending() {
    this.filteredPosts = this.posts
      .sort((a, b) => (b.likes + b.comments.length + b.Shares) - (a.likes + a.comments.length + a.Shares));
  }

  filterByRecent() {
    this.filteredPosts = this.posts
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Enhanced sharing functionality
  shareToFacebook() {
    if (this.selectedPost) {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.postUrl)}`;
      window.open(url, '_blank', 'width=600,height=400');
    }
  }

  shareToTwitter() {
    if (this.selectedPost) {
      const text = `Check out this post by ${this.selectedPost.username}`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(this.postUrl)}`;
      window.open(url, '_blank', 'width=600,height=400');
    }
  }

  shareToWhatsApp() {
    if (this.selectedPost) {
      const text = `Check out this post by ${this.selectedPost.username}: ${this.postUrl}`;
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  }

  shareToLinkedIn() {
    if (this.selectedPost) {
      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.postUrl)}`;
      window.open(url, '_blank', 'width=600,height=400');
    }
  }

  // Add post reaction feature
  addReaction(post: Post, reaction: string) {
    if (!post.reactions) {
      post.reactions = {};
    }
    if (!post.reactions[reaction]) {
      post.reactions[reaction] = 0;
    }
    post.reactions[reaction]++;
    // Update UI to show reaction
    this.updateReactionUI(post);
  }

  private updateReactionUI(post: Post) {
    post.topReactions = Object.entries(post.reactions || {})
      .map(([reaction, count]) => ({ reaction, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }

  showReactionUsers(post: Post) {
    post.showReactionUsers = !post.showReactionUsers;
  }

  showCommentLikes(comment: Comment) {
    comment.showLikedBy = !comment.showLikedBy;
  }

  // Generate a unique ID for comments
  private generateCommentId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Toggle reply input for a comment
  toggleReplyInput(comment: Comment) {
    comment.showReplyInput = !comment.showReplyInput;
    if (!comment.showReplyInput) {
      this.currentReplyText = '';
    }
  }

  // Add a reply to a comment
  addReply(comment: Comment, replyText: string) {
    if (!replyText.trim()) return;

    const reply: Comment = {
      id: this.generateCommentId(),
      username: this.currentUser,
      text: replyText,
      likes: 0,
      likedBy: [],
      timestamp: new Date(),
      profileImageUrl: this.user[0].profileImageUrl,
      parentId: comment.id
    };

    if (!comment.replies) {
      comment.replies = [];
    }
    comment.replies.push(reply);
    this.currentReplyText = '';
    comment.showReplyInput = false;
  }
}
