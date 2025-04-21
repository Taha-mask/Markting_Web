import { Component, HostListener, ViewChild, ElementRef, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { trigger, transition, style, animate } from '@angular/animations';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Post } from '../../interfaces/post';
import { AuthService } from '../../services/auth.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as bootstrap from 'bootstrap';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts = new Subject<Post[]>();

  getPosts(): Observable<Post[]> {
    return this.posts.asObservable();
  }

  addPost(post: Post) {
    // Implementation
  }

  updatePost(post: Post) {
    // Implementation  
  }

  deletePost(post: Post) {
    // Implementation
  }
}

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
  id: string;
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
export class ProfileComponent implements OnInit, OnDestroy, CanActivate {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('postImageInput') postImageInput!: ElementRef;

  isDropdownVisible = false;
  currentUser = 'Taha Mahmoud';
  showEmojiPicker = false;
  activeCategory: string = 'All';
  isLoading: boolean = false;
  showImagePreview: boolean = false;
  previewImage: string | ArrayBuffer | null = null;

  newPostContent: string = '';
  newPostImages: string[] = [];
  newPortfolioItem: any = { title: '', description: '', category: 'Social Media', link: '', imageUrl: '' };
  newAchievement: any = { title: '', description: '', date: '', icon: 'trophy', category: '' };
  currentPassword: string = '';
  newPassword: string = '';
  profileVisibility: string = 'Public';
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
      isFollowing: false,
      comments: [
        {
          id: 'comment-1',
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
    profileViews: 1250,
    postEngagement: 85,
    averageRating: 4.8,
    completedProjects: 45,
    clientSatisfaction: 98,
    followerGrowth: 12
  };

  availability = {
    status: 'Available',
    workHours: '9:00 AM - 5:00 PM',
    timezone: 'GMT+2',
    responseTime: '< 24 hours'
  };
  user: User[] = [
    {
      id: '1',
      username: 'Taha Mahmoud',
      type: 'Marketer', 
      profileImageUrl: 'images/user-1.png',
      status: 'Online',
      role: 'user'
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

  location: string = 'Egypt, Assiut';
  phoneNumber: string = '01120927249';
  email: string = 'taha.mahmoud.eng@gmail.com';

  isEditingLocation: boolean = false;
  isEditingPhoneNumber: boolean = false;
  isEditingEmail: boolean = false;

  rating: number = 4.5;
  selectedPortfolioCategory: string = 'All';
  isEditingAvailability: boolean = false;
  showAnalytics: boolean = false;
  showTestimonials: boolean = true;
  portfolioView: 'grid' | 'list' = 'grid';

  userFol = [
    { name: 'Wade Warren', title: 'Digital Marketing Specialist', img: 'images/user-1.png', Follow: false },
    { name: 'Darlene Robertson', title: 'Digital Marketing Specialist', img: 'images/user-2.png', Follow: false },
  ];

  recentActivities: any[] = [
    {
      icon: 'bi bi-heart-fill text-danger',
      description: 'Liked Social Media Campaign Strategy post',
      timestamp: new Date(2025, 2, 15, 14, 30)
    }
  ];

  private postSubscription: any;
  private authService = inject(AuthService);

  constructor(
    private postService: PostService,
    private router: Router
  ) {
    this.loadUserData();
    this.initializePortfolio();
    this.initializeCertifications();
    this.initializeTestimonials();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.getCurrentUser();
    const profileId = route.params['id'];
    if (currentUser && currentUser.id === profileId && currentUser.role === 'marketer') {
      return true;
    }
    this.router.navigate(['/unauthorized']);
    return false;
  }

  ngOnInit() {
    this.initializeProfile();
    this.startAnalyticsTracking();

    this.posts.forEach(post => {
      post.profileImageUrl = this.user[0].profileImageUrl;
    });

    this.postSubscription = this.postService.getPosts().subscribe((updatedPosts: Post[]) => {
      updatedPosts.forEach(post => {
        post.profileImageUrl = this.user[0].profileImageUrl;
      });

      this.posts = updatedPosts.filter(post =>
        post.username === this.user[0].username
      );

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

  createPost() {
    if (this.newPostContent.trim() || this.newPostImages.length) {
      const newPost: Post = {
        username: this.user[0].username,
        profileImageUrl: this.user[0].profileImageUrl,
        timestamp: new Date(),
        content: this.newPostContent,
        isFollowing: false,
        category: 'Marketing',
        images: [...this.newPostImages],
        currentImageIndex: 0,
        likes: 0,
        Shares: 0,
        Saves: 0,
        showComments: false,
        isEditing: false,
        liked: false,
        saved: false,
        comments: [],
        reactions: {}
      };
      this.posts.unshift(newPost);
      this.postService.addPost(newPost);
      this.newPostContent = '';
      this.newPostImages = [];
      this.stats.posts++;
    }
  }

  editPost(post: Post) {
    post.isEditing = true;
    post.content = post.content; // Store current content temporarily
  }

  savePostEdit(post: Post) {
    post.isEditing = false;
    this.postService.updatePost(post);
  }

  cancelPostEdit(post: Post) {
    post.isEditing = false;
  }

  deletePost(post: Post) {
    const index = this.posts.indexOf(post);
    if (index > -1) {
      this.posts.splice(index, 1);
      this.postService.deletePost(post);
      this.stats.posts--;
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

  onPostImageChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.newPostImages.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  addPortfolioItem(item: any) {
    this.portfolioItems.push(item);
  }

  editPortfolioItem(item: any) {
    this.newPortfolioItem = { ...item };
    const modal = new bootstrap.Modal(document.getElementById('addPortfolioModal')!);
    modal.show();
  }

  deletePortfolioItem(item: any) {
    const index = this.portfolioItems.indexOf(item);
    if (index > -1) {
      this.portfolioItems.splice(index, 1);
    }
  }

  savePortfolioItem() {
    if (this.newPortfolioItem.title && this.newPortfolioItem.description) {
      const index = this.portfolioItems.findIndex(item => item.title === this.newPortfolioItem.title && item !== this.newPortfolioItem);
      if (index > -1) {
        this.portfolioItems[index] = { ...this.newPortfolioItem };
      } else {
        this.portfolioItems.push({ ...this.newPortfolioItem });
      }
      this.newPortfolioItem = { title: '', description: '', category: 'Social Media', link: '', imageUrl: '' };
      const modal = bootstrap.Modal.getInstance(document.getElementById('addPortfolioModal')!);
      modal?.hide();
    }
  }

  onPortfolioImageChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.newPortfolioItem.imageUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  openAddPortfolioModal() {
    this.newPortfolioItem = { title: '', description: '', category: 'Social Media', link: '', imageUrl: '' };
    const modal = new bootstrap.Modal(document.getElementById('addPortfolioModal')!);
    modal.show();
  }

  filterPortfolio(category: string) {
    this.selectedPortfolioCategory = category;
  }

  togglePortfolioView() {
    this.portfolioView = this.portfolioView === 'grid' ? 'list' : 'grid';
  }

  editAchievement(achievement: any) {
    this.newAchievement = { ...achievement };
    const modal = new bootstrap.Modal(document.getElementById('addAchievementModal')!);
    modal.show();
  }

  saveAchievement() {
    if (this.newAchievement.title && this.newAchievement.description) {
      const index = this.achievements.findIndex(ach => ach.title === this.newAchievement.title && ach !== this.newAchievement);
      if (index > -1) {
        this.achievements[index] = { ...this.newAchievement };
      } else {
        this.achievements.push({ ...this.newAchievement });
      }
      this.newAchievement = { title: '', description: '', date: '', icon: 'trophy', category: '' };
      const modal = bootstrap.Modal.getInstance(document.getElementById('addAchievementModal')!);
      modal?.hide();
    }
  }

  openAddAchievementModal() {
    this.newAchievement = { title: '', description: '', date: '', icon: 'trophy', category: '' };
    const modal = new bootstrap.Modal(document.getElementById('addAchievementModal')!);
    modal.show();
  }

  openEditProfileModal() {
    const modal = new bootstrap.Modal(document.getElementById('editProfileModal')!);
    modal.show();
  }

  saveProfileChanges() {
    this.user[0].username = this.user[0].username.trim();
    this.user[0].type = this.user[0].type.trim();
    this.bio = this.bio.trim();
    this.phoneNumber = this.phoneNumber.trim();
    this.email = this.email.trim();
    this.authService.updateUserProfile(this.user[0]);
    const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal')!);
    modal?.hide();
  }

  previewPublicProfile() {
    this.router.navigate(['/profile/public', this.user[0].username]);
  }

  openSettingsPanel() {
    const modal = new bootstrap.Modal(document.getElementById('settingsPanel')!);
    modal.show();
  }

  changePassword() {
    if (this.currentPassword && this.newPassword) {
      this.authService.changePassword(this.currentPassword, this.newPassword)
        .then(() => {
          alert('Password updated successfully');
          this.currentPassword = '';
          this.newPassword = '';
          const modal = bootstrap.Modal.getInstance(document.getElementById('settingsPanel')!);
          modal?.hide();
        })
        .catch((error: Error) => {
          alert('Error updating password: ' + error.message);
        });
    }
  }

  connectSocialAccount(platform: string) {
    // Implement OAuth flow for social account connection
    alert(`Connecting to ${platform}... (Implementation pending)`);
  }

  refreshSuggestions() {
    this.userFol = [
      { name: 'New User ' + Math.floor(Math.random() * 100), title: 'Digital Marketing Specialist', img: 'images/user-' + Math.floor(Math.random() * 5 + 1) + '.png', Follow: false },
      { name: 'New User ' + Math.floor(Math.random() * 100), title: 'Content Creator', img: 'images/user-' + Math.floor(Math.random() * 5 + 1) + '.png', Follow: false },
    ];
  }

  clearActivity(activity: any) {
    const index = this.recentActivities.indexOf(activity);
    if (index > -1) {
      this.recentActivities.splice(index, 1);
    }
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.ceil(rating)).fill(0);
  }

  private initializePortfolio() {
    this.portfolioItems = [
      {
        title: 'Social Media Campaign',
        description: 'Successful marketing campaign for a major brand',
        imageUrl: 'path/to/portfolio1.jpg',
        category: 'Social Media'
      }
    ];
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
      clientSatisfaction: 98,
      followerGrowth: 12
    };
  }

  private startAnalyticsTracking() {
    setInterval(() => {
      this.analytics.profileViews += Math.floor(Math.random() * 5);
      this.analytics.followerGrowth = Math.min(100, this.analytics.followerGrowth + Math.random() * 2);
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
      }
    ];
  }

  private initializeTestimonials() {
    this.testimonials = [
      {
        content: 'Excellent work on our marketing campaign!',
        author: 'John Doe',
        company: 'Tech Corp',
        rating: 5,
        date: '2024-03-01'
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
      this.stats.following += 1;
    } else {
      this.stats.following -= 1;
    }
  }

  toggleFollow(userFol: any) {
    this.followUser(userFol);
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

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    // Implement infinite scroll
  }

  removeAchievement(index: number) {
    this.achievements.splice(index, 1);
  }
}
