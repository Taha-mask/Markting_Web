import { Component, HostListener, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { trigger, transition, style, animate } from '@angular/animations';
import { PostService } from '../services/post.service';

interface ReactionCount {
  reaction: string;
  count: number;
}

interface Comment {
  username: string;
  text: string;
  imageUrl?: string;
  likes: number;
  likedBy: string[];
  timestamp: Date;
  profileImageUrl: string;
}

interface Post {
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
  isPinned?: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, PickerModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('400ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(-20px)', opacity: 0 }))
      ])
    ])
  ]
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('coverImageInput') coverImageInput!: ElementRef;
  
  isDropdownVisible = false;
  currentUser = 'Taha Mahmoud';
  showEmojiPicker = false;
  activeCategory: string = 'All';
  isLoading: boolean = false;
  coverImage: string = 'images/cover.jpg';
  showImagePreview: boolean = false;
  previewImage: string | ArrayBuffer | null = null;

  posts: Post[] = [
    {
      username: 'Taha Mahmoud',
      profileImageUrl: '',
      timestamp: new Date(),
      content: 'Just launched a successful social media campaign that increased engagement by 150%! 🚀 #DigitalMarketing #Success',
      category: 'Marketing',
      subCategory: 'Social Media',
      images: ['public/images/post-1.jpg'],
      currentImageIndex: 0,
      likes: 124,
      Shares: 30,
      Saves: 45,
      showComments: false,
      isEditing: false,
      liked: false,
      saved: false,
      comments: [
        {
          username: 'John Doe',
          text: 'Amazing results! Would love to hear more about your strategy.',
          likes: 5,
          likedBy: [],
          timestamp: new Date(),
          profileImageUrl: 'public/images/user-2.png'
        }
      ],
      reactions: {
        '👍': 45,
        '🔥': 32,
        '👏': 28
      }
    },
    {
      username: 'Taha Mahmoud',
      profileImageUrl: '',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      content: 'Sharing my latest insights on email marketing strategies that convert. Check out the full article on my blog!',
      category: 'Marketing',
      subCategory: 'Email Marketing',
      images: [],
      currentImageIndex: 0,
      likes: 89,
      Shares: 25,
      Saves: 38,
      showComments: false,
      isEditing: false,
      liked: true,
      saved: false,
      comments: [],
      reactions: {
        '👍': 35,
        '💡': 28,
        '📈': 26
      }
    }
  ];

  portfolioItems: Array<{
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    link?: string;
  }> = [];
  
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    credentialUrl?: string;
  }> = [];

  testimonials: Array<{
    content: string;
    author: string;
    company: string;
    rating: number;
    date: string;
  }> = [];

  analytics = {
    profileViews: 0,
    postEngagement: 0,
    averageRating: 0,
    completedProjects: 0,
    clientSatisfaction: 0
  };

  availability = {
    status: 'Available',
    workHours: '9:00 AM - 5:00 PM',
    timezone: 'GMT+2',
    responseTime: '< 24 hours'
  };

  users = [
    { imageUrl: 'images/user-1.jpg' },
    { imageUrl: 'images/user-2.jpg' },
    { imageUrl: 'images/user-3.jpg' },
    { imageUrl: 'images/user-4.jpg' },
    { imageUrl: 'images/user-5.jpg' },
    { imageUrl: 'images/user-6.jpg' },
  ];

  user: User[] = [
    {
      username: 'Taha Mahmoud ',
      type: 'Markter',
      profileImageUrl: 'images/user-1.png',
      status: 'Online',
    }
  ];

  stats = {
    followers: 1234,
    following: 567,
    posts: 89,
    views: 12345,
    projectsCompleted: 45,
    clientSatisfaction: 98,
    responseRate: 95
  };

  skills: string[] = [
    'Digital Marketing',
    'Social Media Management',
    'Content Creation',
    'SEO Optimization',
    'Email Marketing',
    'Analytics',
    'Brand Strategy'
  ];

  achievements: Array<{ 
    title: string;
    date: string;
    description: string;
    icon?: string;
    category?: string;
  }> = [
    {
      title: 'Top Marketer Award',
      date: '2024',
      description: 'Recognized for exceptional marketing campaigns',
      icon: 'trophy',
      category: 'Award'
    }
  ];

  profileImageUrl = this.user[0].profileImageUrl;
  isDragging = false;
  scrollLeft: number = 0;
  startX: number = 0;
  bio: string = 'Digital Marketing Specialist | Content Creator | Social Media Expert';
  isEditingBio: boolean = false;

  address: string = 'Al-Medan Store';
  location: string = 'Egypt, Assiut';
  phoneNumber: string = '01120927249';
  email: string = 'taha.mahmoud.eng@gmail.com';

  isEditingAddress: boolean = false;
  isEditingLocation: boolean = false;
  isEditingPhoneNumber: boolean = false;
  isEditingEmail: boolean = false;

  rating: number = 4.5;
  totalViews: number = 150;

  selectedPortfolioCategory: string = 'All';
  isEditingAvailability: boolean = false;
  showAnalytics: boolean = false;
  showTestimonials: boolean = true;
  portfolioView: 'grid' | 'list' = 'grid';
  
  userFol = [
    { name: 'Wade Warren', title: 'Digital Marketing Specialist', img: 'images/user-1.png', Follow: false },
    { name: 'Darlene Robertson', title: 'Digital Marketing Specialist', img: 'https://images.deepai.org/art-image/d88e01d440b64c36962339af16625162/girl-is-a-mix-between-korean-and-egyptian-28c5a5.jpg', Follow: false },
    { name: 'Floyd Miles', title: 'Digital Marketing Specialist', img: 'images/5e6501a0-f969-45e6-9600-413edd76a9f4.jpg', Follow: false },
    { name: 'Bessie Cooper', title: 'Digital Marketing Specialist', img: 'images/0ef442a5-9622-4c64-af78-d6e557723ec9.jpg', Follow: false },
    { name: 'Savannah Nguyen', title: 'Digital Marketing Specialist', img: 'images/user-2.png', Follow: false },
    { name: 'Courtney Henry', title: 'Digital Marketing Specialist', img: 'images/user-3.png', Follow: false },
    { name: 'Brooklyn Simmons', title: 'Digital Marketing Specialist', img: 'images/user-4.png', Follow: false },
    { name: 'Jacob Jones', title: 'Digital Marketing Specialist', img: 'images/user-1.png', Follow: false },
  ];

  recentActivities: any[] = [
    {
      icon: 'bi bi-heart-fill text-danger',
      description: 'Liked Social Media Campaign Strategy post',
      timestamp: new Date(2025, 2, 15, 14, 30)
    },
    {
      icon: 'bi bi-share-fill text-primary',
      description: 'Shared Content Marketing Tips',
      timestamp: new Date(2025, 2, 15, 12, 45)
    },
    {
      icon: 'bi bi-trophy-fill text-warning',
      description: 'Earned Top Marketer Badge',
      timestamp: new Date(2025, 2, 15, 10, 15)
    }
  ];

  private postSubscription: any;

  constructor(private postService: PostService) {
    this.loadUserData();
    this.initializePortfolio();
    this.initializeCertifications();
    this.initializeTestimonials();
  }

  ngOnInit() {
    this.initializeProfile();
    this.startAnalyticsTracking();
    this.posts.forEach(post => {
      post.profileImageUrl = this.user[0].profileImageUrl;
    });

    this.postSubscription = this.postService.getPostObservable().subscribe((newPost: Post) => {
      newPost.profileImageUrl = this.user[0].profileImageUrl;
      this.posts.unshift(newPost);
      this.stats.posts = this.posts.length;
    });
  }

  ngOnDestroy() {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }

  private initializeProfile() {
    this.loadPosts();
    this.calculateStats();
    this.setupEventListeners();
    this.loadAnalytics();
    this.profileImageUrl = this.user[0].profileImageUrl;
  }

  private loadPosts() {
    this.stats.posts = this.posts.length;
  }

  toggleLike(post: Post) {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    
    if (post.reactions) {
      post.reactions['👍'] = (post.reactions['👍'] || 0) + (post.liked ? 1 : -1);
    }
  }

  sharePost(post: Post) {
    post.Shares += 1;
  }

  toggleSave(post: Post) {
    post.saved = !post.saved;
    post.Saves += post.saved ? 1 : -1;
  }

  toggleComments(post: Post) {
    post.showComments = !post.showComments;
  }

  prevImage(post: Post) {
    if (post.currentImageIndex > 0) {
      post.currentImageIndex--;
    }
  }

  nextImage(post: Post) {
    if (post.currentImageIndex < post.images.length - 1) {
      post.currentImageIndex++;
    }
  }

  getTopReactions(post: Post): ReactionCount[] {
    if (!post.reactions) return [];
    
    return Object.entries(post.reactions)
      .map(([reaction, count]) => ({ reaction, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }

  private initializePortfolio() {
    this.portfolioItems = [
      {
        title: 'Social Media Campaign',
        description: 'Successful marketing campaign for a major brand',
        imageUrl: 'path/to/portfolio1.jpg',
        category: 'Social Media'
      },
      {
        title: 'Content Strategy',
        description: 'Comprehensive content strategy for an e-commerce platform',
        imageUrl: 'path/to/portfolio2.jpg',
        category: 'Content'
      },
      {
        title: 'Email Marketing',
        description: 'High-conversion email campaign for tech startup',
        imageUrl: 'path/to/portfolio3.jpg',
        category: 'Content'
      }
    ];
  }

  deletePost(post: Post) {
    const index = this.posts.indexOf(post);
    if (index > -1) {
      this.posts.splice(index, 1);
    }
  }

  pinPost(post: Post) {
    post.isPinned = !post.isPinned;
    if (post.isPinned) {
      const index = this.posts.indexOf(post);
      if (index > -1) {
        this.posts.splice(index, 1);
        this.posts.unshift(post);
      }
    }
  }

  addPortfolioItem(item: any) {
    this.portfolioItems.push(item);
  }

  filterPortfolio(category: string) {
    this.selectedPortfolioCategory = category;
  }

  togglePortfolioView() {
    this.portfolioView = this.portfolioView === 'grid' ? 'list' : 'grid';
  }

  private loadUserData() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  private calculateStats() {
    this.stats = {
      ...this.stats,
      views: this.analytics.profileViews,
      projectsCompleted: this.analytics.completedProjects,
      clientSatisfaction: this.analytics.clientSatisfaction
    };
  }

  private setupEventListeners() {
    document.addEventListener('click', (event) => {
      if (this.showEmojiPicker && !(event.target as HTMLElement).closest('.emoji-picker-container')) {
        this.showEmojiPicker = false;
      }
    });
  }

  private loadAnalytics() {
    this.analytics = {
      profileViews: 1250,
      postEngagement: 85,
      averageRating: 4.8,
      completedProjects: 45,
      clientSatisfaction: 98
    };
  }

  private startAnalyticsTracking() {
    setInterval(() => {
      this.analytics.profileViews += Math.floor(Math.random() * 5);
      this.calculateStats();
    }, 60000);
  }

  private initializeCertifications() {
    this.certifications = [
      {
        name: 'Digital Marketing Professional',
        issuer: 'Google',
        date: '2024',
        credentialUrl: 'https://example.com/cert'
      },
      {
        name: 'Social Media Marketing Specialist',
        issuer: 'Meta',
        date: '2023',
        credentialUrl: 'https://example.com/cert2'
      }
    ];
  }

  private initializeTestimonials() {
    this.testimonials = [
      {
        content: 'Excellent work on our marketing campaign! The results exceeded our expectations.',
        author: 'John Doe',
        company: 'Tech Corp',
        rating: 5,
        date: '2024-03-01'
      },
      {
        content: 'Great strategic insights and professional approach to social media management.',
        author: 'Sarah Smith',
        company: 'Digital Solutions',
        rating: 4.5,
        date: '2024-02-15'
      }
    ];
  }

  onProfileImageChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageUrl = e.target?.result as string;
        this.profileImageUrl = newImageUrl;
        this.user[0].profileImageUrl = newImageUrl;
        this.posts.forEach(post => {
          post.profileImageUrl = newImageUrl;
        });
      };
      reader.readAsDataURL(file);
    }
  }

  followUser(user: any) {
    user.Follow = !user.Follow;
    if (user.Follow) {
      this.stats.following += 1; // زيادة عدد الـ Following في الـ Left Sidebar
    } else {
      this.stats.following -= 1; // تقليل عدد الـ Following في الـ Left Sidebar
    }
  }

  toggleFollow(userFol: any) {
    this.followUser(userFol);
  }

  onCoverImageChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.coverImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  toggleBioEdit() {
    this.isEditingBio = !this.isEditingBio;
  }

  saveBio() {
    this.isEditingBio = false;
  }

  addCertification(cert: any) {
    this.certifications.push(cert);
  }

  removeCertification(index: number) {
    this.certifications.splice(index, 1);
  }

  addTestimonial(testimonial: any) {
    this.testimonials.push(testimonial);
    this.updateAverageRating();
  }

  private updateAverageRating() {
    const total = this.testimonials.reduce((sum, t) => sum + t.rating, 0);
    this.analytics.averageRating = total / this.testimonials.length;
  }

  updateAvailability(newStatus: string) {
    this.availability.status = newStatus;
  }

  toggleAvailabilityEdit() {
    this.isEditingAvailability = !this.isEditingAvailability;
  }

  saveAvailability() {
    this.isEditingAvailability = false;
  }

  toggleAnalytics() {
    this.showAnalytics = !this.showAnalytics;
  }

  get fullStars(): number[] {
    return Array(Math.floor(this.rating)).fill(0);
  }

  get hasHalfStar(): boolean {
    return this.rating % 1 !== 0;
  }

  get emptyStars(): number[] {
    return Array(5 - Math.ceil(this.rating)).fill(0);
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  addSkill(skill: string) {
    if (skill && !this.skills.includes(skill)) {
      this.skills.push(skill);
    }
  }

  removeSkill(index: number) {
    this.skills.splice(index, 1);
  }

  addAchievement(achievement: { 
    title: string;
    date: string;
    description: string;
    icon?: string;
    category?: string;
  }) {
    this.achievements.push(achievement);
  }

  removeAchievement(index: number) {
    this.achievements.splice(index, 1);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    // Implement infinite scroll
  }
}