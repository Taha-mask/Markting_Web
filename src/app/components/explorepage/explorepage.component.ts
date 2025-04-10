import { Component, HostListener, ViewChild, ElementRef, OnInit, Inject, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { RouterModule } from '@angular/router';
import { PostService } from '../services/post.service';
import { TrendingSidebarComponent } from '../trending-sidebar/trending-sidebar.component';
import { User } from '../../interfaces/user';
import { Post } from '../../interfaces/post';
import { PostComment } from '../../interfaces/Comment';
import { Subscription } from 'rxjs';

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

interface TrendingFeed {
  url: string;
  alt: string;
  title?: string; 
  description?: string; 
  link?: string; 
}

interface SuggestedUser {
  name: string;
  title: string;
  img: string;
  Follow: boolean;
  isProcessing: boolean;
  profilePicture?: string;
  isFollowing?: boolean;
}

@Component({
  selector: 'app-explorepage',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PickerModule, TrendingSidebarComponent],
  templateUrl: './explorepage.component.html',
  styleUrls: ['./explorepage.component.css'],
  providers: [DatePipe, PostService],
})
export class ExplorepageComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild(TrendingSidebarComponent) trendingSidebar!: TrendingSidebarComponent;
  
  isDropdownVisible = false;
  newComment: string = '';
  newCommentImageUrl: string | ArrayBuffer | null = null;
  postContent: string = '';
  currentUser = 'Taha Mahmoud';
  showEmojiPicker = false;

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
      isFollowing: false, 
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
  ];

  private postSubscription: Subscription | null = null;

  activeCategory: string = 'All';
  navbarVisible = true;
  lastScrollTop = 0;
  isShareModalVisible = false;
  selectedPost: Post | null = null;
  postUrl: string = '';
  linkCopied: boolean = false;
  currentReplyText: string = '';

  constructor(@Inject(PostService) private postService: PostService) {}

  ngOnInit() {
    this.postSubscription = this.postService.getPosts().subscribe(
      (updatedPosts: Post[]) => {
        this.posts = updatedPosts;
        this.filterPostsByCategory(this.activeCategory);
      },
      (error) => {
        console.error('Error fetching posts', error);
      }
    );
    this.filterPostsByCategory('All');
  }

  ngOnDestroy() {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }

  filterPostsByCategory(category: string) {
    this.activeCategory = category;
    
    if (category === 'All') {
      this.posts = this.posts;
    } else {
      this.posts = this.posts.filter(post => 
        post.category.toLowerCase() === category.toLowerCase()
      );
    }
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

  subCategories: { [key: string]: string[] } = {
    'Electrical Tools': ['All', 'Power Tools', 'Hand Tools', 'Measuring Tools', 'Safety Equipment'],
    'Food': ['All', 'Snacks', 'Beverages', 'Dairy', 'Bakery', 'Canned Foods'],
    'Medicines': ['All', 'Prescription', 'Over-the-Counter', 'First Aid', 'Vitamins'],
    'Electronics': ['All', 'Smartphones', 'Laptops', 'Tablets', 'Accessories'],
    'Clothing': ['All', 'Men', 'Women', 'Children', 'Accessories'],
    'Fashion': ['All', 'Shoes', 'Bags', 'Jewelry', 'Watches'],
    'Home & Kitchen': ['All', 'Appliances', 'Cookware', 'Storage', 'Cleaning'],
    'Beauty & Personal Care': ['All', 'Skincare', 'Haircare', 'Makeup', 'Fragrances'],
    'Home Appliances': ['All', 'Kitchen', 'Laundry', 'Cleaning', 'Climate Control'],
    'Sports & Fitness': ['All', 'Equipment', 'Clothing', 'Accessories', 'Supplements'],
    'Video Games': ['All', 'Consoles', 'Games', 'Accessories', 'Digital Content'],
    'Toys & Hobbies': ['All', 'Action Figures', 'Board Games', 'Outdoor Toys', 'Arts & Crafts'],
    'Auto Parts': ['All', 'Engine', 'Exterior', 'Interior', 'Accessories'],
    'Groceries': ['All', 'Fresh Food', 'Pantry', 'Beverages', 'Household'],
    'Health & Personal Care': ['All', 'Personal Care', 'Health Care', 'Baby Care', 'Elderly Care'],
    'Books & Media': ['All', 'Books', 'Movies', 'Music', 'Magazines'],
    'Pet Supplies': ['All', 'Food', 'Accessories', 'Health Care', 'Grooming'],
    'Perfumes': ['All', 'Men', 'Women', 'Unisex', 'Gift Sets']
  };

  activeSubCategory: string = '';

  categories: { name: string, icon: string }[] = [
    { name: 'All', icon: 'bi bi-collection' },
    { name: 'Electrical Tools', icon: 'bi bi-tools' },
    { name: 'Food', icon: 'bi bi-egg-fried' },
    { name: 'Medicines', icon: 'bi bi-capsule' },
    { name: 'Electronics', icon: 'bi bi-laptop' },
    { name: 'Clothing', icon: 'bi bi-person' },
    { name: 'Fashion', icon: 'bi bi-handbag' },
    { name: 'Home & Kitchen', icon: 'bi bi-house-door' },
    { name: 'Beauty & Personal Care', icon: 'bi bi-scissors' },
    { name: 'Home Appliances', icon: 'bi bi-fan' },
    { name: 'Sports & Fitness', icon: 'bi bi-bicycle' },
    { name: 'Video Games', icon: 'bi bi-controller' },
    { name: 'Toys & Hobbies', icon: 'bi bi-joystick' },
    { name: 'Auto Parts', icon: 'bi bi-car-front' },
    { name: 'Groceries', icon: 'bi bi-cart' },
    { name: 'Health & Personal Care', icon: 'bi bi-heart-pulse' },
    { name: 'Books & Media', icon: 'bi bi-book' },
    { name: 'Pet Supplies', icon: 'bi bi-heart' },
    { name: 'Perfumes', icon: 'bi bi-flower1' }
  ];

  formatCategoryName(name: string): string {
    return name.replace('&', '<br>&');
  }

  usersFol = [
    { name: 'Wade Warren', title: 'Digital Marketing Specialist', img: 'images/user-1.png', Follow: false, isProcessing: false },
    { name: 'Darlene Robertson', title: 'Digital Marketing Specialist', img: 'https://images.deepai.org/art-image/d88e01d440b64c36962339af16625162/girl-is-a-mix-between-korean-and-egyptian-28c5a5.jpg', Follow: false, isProcessing: false },
    { name: 'Floyd Miles', title: 'Digital Marketing Specialist', img: 'images/5e6501a0-f969-45e6-9600-413edd76a9f4.jpg', Follow: false, isProcessing: false },
    { name: 'Bessie Cooper', title: 'Digital Marketing Specialist', img: 'images/0ef442a5-9622-4c64-af78-d6e557723ec9.jpg', Follow: false, isProcessing: false },
    { name: 'Savannah Nguyen', title: 'Digital Marketing Specialist', img: 'images/user-2.png', Follow: false, isProcessing: false },
    { name: 'Courtney Henry', title: 'Digital Marketing Specialist', img: 'images/user-3.png', Follow: false, isProcessing: false },
    { name: 'Brooklyn Simmons', title: 'Digital Marketing Specialist', img: 'images/user-4.png', Follow: false, isProcessing: false },
    { name: 'Jacob Jones', title: 'Digital Marketing Specialist', img: 'images/user-1.png', Follow: false, isProcessing: false },
  ];

  suggestedUsers: SuggestedUser[] = [
    {
      name: 'Emma Wilson',
      title: 'Digital Marketing Specialist',
      img: 'images/user-2.png',
      Follow: false,
      isProcessing: false
    },
    {
      name: 'Jacob Jones',
      title: 'Content Creator',
      img: 'images/user-3.png',
      Follow: false,
      isProcessing: false
    }
  ];

  trendingFeeds: TrendingFeed[] = [
    { 
      url: 'https://images.deepai.org/art-image/fca7454eeb5b41f18f1f1dd7f5d31e74/a-small-closed-room-with-a-small-bed-that-can_gH54Ii2.jpg', 
      alt: 'Feed 1', 
      title: 'Cozy Room', 
      link: 'https://example.com/feed1' 
    },
    { 
      url: 'https://images.deepai.org/art-image/d9f992e2353d4652b8e5e3a419935d50/a-small-closed-room-with-a-small-bed-that-can_XL2tHnl.jpg', 
      alt: 'Feed 2', 
      title: 'Minimalist Design', 
      link: 'https://example.com/feed2' 
    },
    { 
      url: 'https://images.deepai.org/art-image/3a07efb0d73b46728bad3e1db4c74ffe/a-small-closed-room-with-a-small-bed-that-can_cNnH96r.jpg', 
      alt: 'Feed 3', 
      title: 'Modern Bedroom', 
      description: 'A modern take on small spaces.', 
      link: 'https://example.com/feed3' 
    },
    { 
      url: 'https://images.deepai.org/art-image/7e55e370ca7646f59074e58d698eb026/a-small-closed-room-with-a-small-bed-that-can_vANQe8W.jpg', 
      alt: 'Feed 4', 
      title: 'Compact Living', 
      description: 'Efficient use of space.', 
      link: 'https://example.com/feed4' 
    }
  ];

  followUser(user: any) {
    user.Follow = !user.Follow;
    if (this.trendingSidebar) {
      this.trendingSidebar[user.Follow ? 'incrementFollowingCount' : 'decrementFollowingCount']();
    }
    const message = user.Follow ? `Following ${user.name}` : `Unfollowed ${user.name}`;
    console.log(message);
  }

  private convertToPost(user: SuggestedUser): Post {
    return {
      username: user.name,
      profileImageUrl: user.img,
      timestamp: new Date(),
      content: user.title,
      category: '',
      images: [],
      currentImageIndex: 0,
      likes: 0,
      Shares: 0,
      Saves: 0,
      showComments: false,
      isEditing: false,
      liked: false,
      saved: false,
      isFollowing: user.Follow,
      comments: []
    };
  }

  toggleFollow(input: Post | SuggestedUser) {
    const isPost = 'username' in input;
    const isUser = 'name' in input;

    if (isPost) {
      const post = input as Post;
      post.isFollowing = !post.isFollowing;
      
      const message = post.isFollowing ? 
        `Following ${post.username}` : 
        `Unfollowed ${post.username}`;
      console.log(message);
    } else if (isUser) {
      const user = input as SuggestedUser;
      user.Follow = !user.Follow;
      
      const message = user.Follow ? 
        `Following ${user.name}` : 
        `Unfollowed ${user.name}`;
      console.log(message);
    }
  }

  filteredPosts: Post[] = [];

  filterPostsBySubCategory(subCategoryName: string) {
    this.activeSubCategory = subCategoryName;
    if (subCategoryName === 'All') {
      this.filterPostsByCategory(this.activeCategory);
    } else {
      this.posts = this.postService.filterBySubCategory(this.activeCategory, subCategoryName);
    }
  }

  getBentoItemClass(index: number): string {
    const pattern = [
      'bento-large', 'bento-small', 'bento-small', 'bento-medium',
      'bento-medium', 'bento-small', 'bento-small', 'bento-large'
    ];
    return pattern[index % pattern.length];
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  addFriend(user: any) {
    console.log('Friend request sent to', user.name);
  }

  hidePost(post: Post) {
    const index = this.filteredPosts.indexOf(post);
    if (index > -1) {
      this.filteredPosts.splice(index, 1);
    }
  }

  snoozeUser(post: Post, days: number) {
    alert(`Snoozed ${post.username} for ${days} days`);
  }

  blockUser(post: Post) {
    alert(`Blocked ${post.username}`);
  }

  likePost(post: Post) {
    if (post.liked) {
      post.likes--;
    } else {
      post.likes++;
    }
    post.liked = !post.liked;
  }

  toggleComments(post: Post) {
    post.showComments = !post.showComments;
  }

  sharePost(post: Post) {
    this.selectedPost = post;
    const postId = post.id || Date.now().toString();
    this.postUrl = `${window.location.origin}/post/${postId}`;
    const modal = document.getElementById('shareModal');
    if (modal) {
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
    post.Shares++;
  }

  toggleEdit(post: Post) {
    post.isEditing = !post.isEditing;
  }

  savePost(post: Post) {
    post.isEditing = false;
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    this.newComment += event.emoji.native;
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
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

  addPost() {
    if (this.postContent.trim()) {
      const newPost = {
        username: this.user[0].username,
        profileImageUrl: this.user[0].profileImageUrl,
        timestamp: new Date(),
        content: this.postContent,
        category: this.activeCategory,
        subCategory: this.activeSubCategory,
        images: this.newCommentImageUrl ? [this.newCommentImageUrl.toString()] : [],
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
    this.newCommentImageUrl = null;
    this.showEmojiPicker = false;
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
    const walk = (x - this.startX) * 2;
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

  nextImage(post: Post) {
    if (post.currentImageIndex < post.images.length - 1) {
      post.currentImageIndex++;
    }
  }

  prevImage(post: Post) {
    if (post.currentImageIndex > 0) {
      post.currentImageIndex--;
    }
  }

  deleteComment(post: Post, commentIndex: number) {
    if (post.comments[commentIndex].username === this.currentUser) {
      post.comments.splice(commentIndex, 1);
    } else {
      alert('You can only delete your own comments.');
    }
  }

  editComment(post: Post, comment: PostComment) {
    const newCommentText = prompt('Edit your comment:', comment.text);
    if (newCommentText !== null) {
      comment.text = newCommentText;
    }
  }

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

  toggleCommentLike(comment: PostComment) {
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

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.emoji-picker-container') && !target.closest('.bi-emoji-smile')) {
      this.showEmojiPicker = false;
    }
  }

  editPost(post: Post) {
    post.isEditing = true;
  }

  deletePost(post: Post) {
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
    this.subCategories = {};
    this.filterPostsByCategory('All');
  }

  getSubCategories(categoryName: string): string[] {
    return this.subCategories[categoryName] || [];
  }

  showSubCategories(category: { name: string, icon: string }) {
    this.activeCategory = category.name;
    if (this.activeCategory === 'All') {
      this.filterPostsByCategory('All');
    } else {
      this.filterPostsByCategory(category.name);
      if (this.subCategories[category.name]) {
        this.activeSubCategory = 'All';
        this.filterPostsBySubCategory('All');
      }
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
    this.filterPostsByCategory(this.activeCategory);
  }

  shareViaMessage(post: Post) {
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
      const dummyUrl = `https://yoursite.com/post/${Date.now()}`;
      navigator.clipboard.writeText(dummyUrl);
    }
  }

  filterByTrending() {
    this.posts = this.posts
      .sort((a, b) => (b.likes + b.comments.length + b.Shares) - (a.likes + a.comments.length + a.Shares));
  }

  filterByRecent() {
    this.posts = this.posts
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

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

  addReaction(post: Post, reaction: string) {
    if (!post.reactions) {
      post.reactions = {};
    }
    if (!post.reactions[reaction]) {
      post.reactions[reaction] = 0;
    }
    post.reactions[reaction]++;
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

  showCommentLikes(comment: PostComment) {
    comment.showLikedBy = !comment.showLikedBy;
  }

  private generateCommentId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  toggleReplyInput(comment: PostComment) {
    comment.showReplyInput = !comment.showReplyInput;
    if (!comment.showReplyInput) {
      this.currentReplyText = '';
    }
  }

  addReply(comment: PostComment, replyText: string) {
    if (!replyText.trim()) return;

    const reply: PostComment = {
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

  onTrendingFeedClick(feed: TrendingFeed) {
    if (feed.link) {
      window.open(feed.link, '_blank'); 
    } else {
      console.log('Clicked on trending feed:', feed.title);
    }
  }

  toggleFollowSuggested(user: any) {
    if (user.isProcessing) return;
    
    user.isProcessing = true;
    user.Follow = !user.Follow;
    
    const message = user.Follow ? 
      `Following ${user.name}` : 
      `Unfollowed ${user.name}`;
    console.log(message);
    
    setTimeout(() => {
      user.isProcessing = false;
      
      if (user.Follow) {
        setTimeout(() => {
          this.suggestedUsers = this.suggestedUsers.filter(u => u.name !== user.name);
          
          if (this.suggestedUsers.length < 4) {
            const newUser = {
              name: 'Sarah Parker',
              title: 'Digital Strategist',
              img: 'images/user-2.png',
              profilePicture: 'images/user-2.png',
              Follow: false,
              isFollowing: false,
              isProcessing: false
            };
            this.suggestedUsers.push(newUser);
          }
        }, 1000);
      }
    }, 500);
  }
}