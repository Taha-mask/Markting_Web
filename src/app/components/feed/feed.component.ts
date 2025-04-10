import { Component, HostListener, ViewChild, ElementRef, OnInit, Inject, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { Post } from '../../interfaces/post';
import { PostComment } from '../../interfaces/Comment';
import { RouterModule } from '@angular/router';
import { PostService } from '../services/post.service';
import { TrendingSidebarComponent } from '../trending-sidebar/trending-sidebar.component';
import { User } from '../../interfaces/user';
import { Subscription } from 'rxjs';
import { Dropdown } from 'bootstrap';

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

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PickerModule, TrendingSidebarComponent],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
  providers: [DatePipe]
})
export class FeedComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild(TrendingSidebarComponent) trendingSidebar!: TrendingSidebarComponent;
  @ViewChildren('commentContainer') commentContainers!: QueryList<ElementRef>;
  isDropdownVisible = false;
  postContent: string = '';
  filteredPosts: any[] = [];
  user: any[] = [
    {
      username: 'Taha Mahmoud',
      profileImageUrl: 'assets/images/profile.jpg'
    }
  ];
  currentUser = 'Taha Mahmoud';
  activeCategory: string = 'All';
  activeSubCategory: string = '';
  subCategories: any[] = [];
  navbarVisible = true;
  lastScrollTop = 0;
  private startX = 0;
  private scrollLeft = 0;
  private isDragging = false;
  selectedPost: any;
  postUrl: string = '';
  linkCopied: boolean = false;
  currentReplyText: string = '';
  showEmojiPicker: boolean = false;
  newComment: string = '';
  private postSubscription: Subscription | null = null;

  categories = [
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
    { name: 'Perfumes', icon: 'bi bi-flower1' },
  ];

  usersFol = [
    { name: 'Wade Warren', title: 'Digital Marketing Specialist', img: 'images/user-1.png', Follow: false },
    { name: 'Darlene Robertson', title: 'Digital Marketing Specialist', img: 'https://images.deepai.org/art-image/d88e01d440b64c36962339af16625162/girl-is-a-mix-between-korean-and-egyptian-28c5a5.jpg', Follow: false },
    { name: 'Floyd Miles', title: 'Digital Marketing Specialist', img: 'images/5e6501a0-f969-45e6-9600-413edd76a9f4.jpg', Follow: false },
    { name: 'Bessie Cooper', title: 'Digital Marketing Specialist', img: 'images/0ef442a5-9622-4c64-af78-d6e557723ec9.jpg', Follow: false },
    { name: 'Savannah Nguyen', title: 'Digital Marketing Specialist', img: 'images/user-2.png', Follow: false },
    { name: 'Courtney Henry', title: 'Digital Marketing Specialist', img: 'images/user-3.png', Follow: false },
    { name: 'Brooklyn Simmons', title: 'Digital Marketing Specialist', img: 'images/user-4.png', Follow: false },
    { name: 'Jacob Jones', title: 'Digital Marketing Specialist', img: 'images/user-1.png', Follow: false },
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

  formatCategoryName(name: string): string {
    return name.replace('&', '<br>&');
  }

  followUser(user: any) {
    user.Follow = !user.Follow;
    if (user.Follow) {
      this.trendingSidebar.incrementFollowingCount();
    } else {
      this.trendingSidebar.decrementFollowingCount();
    }
  }

  toggleFollow(userFol: any) {
    this.followUser(userFol);
  }

  showSubCategories(category: any) {
    this.activeCategory = category.name;
    if (category.name === 'All') {
      this.filterPostsByCategory('All');
    } else {
      this.subCategories = this.getSubCategories(category.name);
      this.filterPostsByCategory(category.name);
    }
  }

  getSubCategories(categoryName: string): any[] {
    const subCategoriesMap: { [key: string]: string[] } = {
      'Electronics': ['Phones', 'Laptops', 'Tablets', 'Accessories'],
      'Food': ['Restaurants', 'Recipes', 'Groceries', 'Delivery'],
      'Medicines': ['Prescription', 'Over-the-counter', 'Supplements'],
      'Clothing': ['Men', 'Women', 'Kids', 'Accessories'],
      'Fashion': ['Trends', 'Accessories', 'Shoes', 'Bags'],
      'Home & Kitchen': ['Appliances', 'Furniture', 'Decor', 'Cookware'],
      'Beauty & Personal Care': ['Skincare', 'Makeup', 'Hair Care', 'Fragrance'],
      'Sports & Fitness': ['Equipment', 'Apparel', 'Supplements', 'Training'],
      'Books & Media': ['Books', 'Movies', 'Music', 'Games'],
      // Add more subcategories as needed
    };

    return (subCategoriesMap[categoryName] || []).map(name => ({
      name,
      icon: this.getIconForSubCategory(name)
    }));
  }

  getIconForSubCategory(name: string): string {
    const iconMap: { [key: string]: string } = {
      'Phones': 'bi bi-phone',
      'Laptops': 'bi bi-laptop',
      'Tablets': 'bi bi-tablet',
      'Accessories': 'bi bi-headphones',
      'Restaurants': 'bi bi-shop',
      'Recipes': 'bi bi-journal-text',
      'Groceries': 'bi bi-cart',
      'Delivery': 'bi bi-truck',
      'Men': 'bi bi-gender-male',
      'Women': 'bi bi-gender-female',
      'Kids': 'bi bi-people',
      'Trends': 'bi bi-graph-up',
      'Shoes': 'bi bi-boot',
      'Bags': 'bi bi-handbag',
      'Appliances': 'bi bi-fan',
      'Furniture': 'bi bi-lamp',
      'Decor': 'bi bi-house-heart',
      'Cookware': 'bi bi-cup-hot',
      'Skincare': 'bi bi-droplet',
      'Makeup': 'bi bi-brush',
      'Hair Care': 'bi bi-scissors',
      'Fragrance': 'bi bi-flower1',
      'Equipment': 'bi bi-gear',
      'Apparel': 'bi bi-person-workspace',
      'Training': 'bi bi-person-walking',
      'Books': 'bi bi-book',
      'Movies': 'bi bi-film',
      'Music': 'bi bi-music-note',
      'Games': 'bi bi-controller'
    };
    return iconMap[name] || 'bi bi-tag';
  }

  filterPostsByCategory(categoryName: string) {
    console.log('Filtering by category:', categoryName); // Debug log
    console.log('Current posts:', this.samplePosts); // Debug log
    
    this.activeCategory = categoryName;
    if (categoryName === 'All') {
      this.filteredPosts = [...this.samplePosts].sort((a, b) => 
        (b.timestamp as any) - (a.timestamp as any)
      );
    } else {
      this.filteredPosts = this.samplePosts
        .filter(post => post.category === categoryName)
        .sort((a, b) => (b.timestamp as any) - (a.timestamp as any));
    }
    
    console.log('Filtered posts:', this.filteredPosts); // Debug log
  }

  filterPostsBySubCategory(subCategoryName: string) {
    this.activeSubCategory = subCategoryName;
    if (this.activeCategory === 'All') {
      this.filteredPosts = [...this.samplePosts];
    } else {
      this.filteredPosts = this.samplePosts.filter(post => 
        post.category === this.activeCategory && 
        (!subCategoryName || post.subCategory === subCategoryName)
      ).sort((a, b) => (b.timestamp as any) - (a.timestamp as any));
    }
  }

  // Sample posts data
  samplePosts: any[] = [
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

  hidePost(post: any) {
    const index = this.filteredPosts.indexOf(post);
    if (index > -1) {
      this.filteredPosts.splice(index, 1);
    }
  }

  snoozeUser(post: any, days: number) {
    alert(`Snoozed ${post.username} for ${days} days`);
  }

  blockUser(post: any) {
    alert(`Blocked ${post.username}`);
  }

  likePost(post: any) {
    if (post.liked) {
      post.likes--;
    } else {
      post.likes++;
    }
    post.liked = !post.liked;
  }

  toggleComments(post: any) {
    post.showComments = !post.showComments;
  }

  sharePost(post: any) {
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

  toggleEdit(post: any) {
    post.isEditing = !post.isEditing;
  }

  savePost(post: any) {
    post.isEditing = false;
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    this.postContent += event.emoji.native;
    this.showEmojiPicker = false;
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          // Add the image to the post when it's created
        }
      };
      reader.readAsDataURL(file);
    }
  }

  addPost() {
    if (this.postContent.trim()) {
      const newPost: any = {
        username: this.currentUser,
        profileImageUrl: this.user[0].profileImageUrl,
        timestamp: new Date(),
        content: this.postContent,
        category: this.activeCategory,
        subCategory: this.activeSubCategory,
        images: [],
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
      this.samplePosts.unshift(newPost);
      this.postContent = '';
      this.filterPostsByCategory(this.activeCategory);
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
    const walk = (x - this.startX) * 2;
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

  nextImage(post: any) {
    if (post.currentImageIndex < post.images.length - 1) {
      post.currentImageIndex++;
    }
  }

  prevImage(post: any) {
    if (post.currentImageIndex > 0) {
      post.currentImageIndex--;
    }
  }

  deleteComment(post: any, commentIndex: number) {
    post.comments.splice(commentIndex, 1);
  }

  editComment(comment: any) {
    this.resetAllEditingStates();
    comment.isEditing = true;
    comment.editText = comment.text;
  }

  saveCommentEdit(comment: any) {
    if (comment.editText && comment.editText.trim()) {
      if (!comment.editHistory) {
        comment.editHistory = [];
      }
      comment.editHistory.push({
        text: comment.text,
        editedBy: this.currentUser,
        timestamp: new Date()
      });
      comment.text = comment.editText.trim();
      comment.lastEditedBy = this.currentUser;
    }
    comment.isEditing = false;
    comment.editText = undefined;
  }

  cancelCommentEdit(comment: any) {
    comment.isEditing = false;
    comment.editText = undefined;
  }

  restoreCommentVersion(comment: any, event: Event) {
    const target = event.target as HTMLSelectElement;
    if (!target) {
      console.warn('Event target is null');
      return;
    }
    const selectedIndex = parseInt(target.value);
    if (comment.editHistory && selectedIndex >= 0 && selectedIndex < comment.editHistory.length) {
      const selectedVersion = comment.editHistory[selectedIndex];
      comment.text = selectedVersion.text;
      comment.lastEditedBy = selectedVersion.editedBy;
    }
    comment.isEditing = false;
  }

  private resetAllEditingStates() {
    this.samplePosts.forEach((post: any) => {
      post.comments.forEach((c: any) => {
        c.isEditing = false;
        c.editText = undefined;
        c.replies?.forEach((reply: any) => {
          reply.isEditing = false;
          reply.editText = undefined;
        });
      });
    });
  }

  editReply(reply: any) {
    reply.isEditing = true;
    reply.editText = reply.text;
  }

  saveReplyEdit(reply: any) {
    if (reply.editText && reply.editText.trim()) {
      reply.text = reply.editText.trim();
    }
    reply.isEditing = false;
  }

  cancelReplyEdit(reply: any) {
    reply.isEditing = false;
    reply.editText = undefined;
  }

  toggleCommentLike(comment: any) {
    comment.isLikedByCurrentUser = !comment.isLikedByCurrentUser;
    comment.likes += comment.isLikedByCurrentUser ? 1 : -1;
  }

  isCommentLikedByCurrentUser(comment: any): boolean {
    return comment.isLikedByCurrentUser || false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.emoji-picker-container') && !target.closest('.bi-emoji-smile')) {
      this.showEmojiPicker = false;
    }
  }

  editPost(post: any) {
    post.isEditing = true;
  }

  deletePost(post: any) {
    const index = this.filteredPosts.indexOf(post);
    if (index > -1) {
      this.filteredPosts.splice(index, 1);
    }
  }

  reportPost(post: any) {
    alert(`Reported post by ${post.username}`);
  }

  unfollow(post: any) {
    alert(`Unfollowed ${post.username}`);
  }

  goBackToCategories() {
    this.activeCategory = 'All';
    this.activeSubCategory = '';
    this.subCategories = [];
    this.filterPostsByCategory('All');
  }

  shareViaMessage(post: any) {
    console.log('Sharing via message:', post);
  }

  copyLink(input: HTMLInputElement | any) {
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
    this.filteredPosts = this.samplePosts
      .sort((a, b) => (b.likes + b.comments.length + b.Shares) - (a.likes + a.comments.length + a.Shares));
  }

  filterByRecent() {
    this.filteredPosts = this.samplePosts
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

  addReaction(post: any, reaction: string) {
    if (!post.reactions) {
      post.reactions = {};
    }
    if (!post.reactions[reaction]) {
      post.reactions[reaction] = 0;
    }
    post.reactions[reaction]++;
    this.updateReactionUI(post);
  }

  private updateReactionUI(post: any) {
    post.topReactions = Object.entries(post.reactions || {})
      .map(([reaction, count]): ReactionCount => ({ reaction, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }

  showReactionUsers(post: any) {
    post.showReactionUsers = !post.showReactionUsers;
  }

  showCommentLikes(comment: any) {
    comment.showLikedBy = !comment.showLikedBy;
  }

  private generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  addComment(post: any, commentText: string) {
    if (!commentText || commentText.trim() === '') return;

    const newComment: any = {
      id: this.generateUniqueId(),
      username: this.currentUser,
      profileImageUrl: this.user[0].profileImageUrl,
      text: commentText.trim(),
      timestamp: new Date(),
      likes: 0,
      likedBy: [],
      replies: []
    };

    // Add the comment to the post
    if (!post.comments) {
      post.comments = [];
    }
    post.comments.push(newComment);

    // Reset comment input
    this.newComment = '';

    // Scroll to the newly added comment
    this.scrollToLastComment(post);
  }

  scrollToLastComment(post: any) {
    // Use setTimeout to ensure DOM has updated
    setTimeout(() => {
      try {
        // Find the last comment in this post's comments
        const lastCommentIndex = post.comments.length - 1;
        const lastCommentElement = document.querySelector(
          `.comment-item:nth-child(${lastCommentIndex + 1})`
        );

        if (lastCommentElement) {
          lastCommentElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      } catch (error) {
        console.error('Error scrolling to comment:', error);
      }
    }, 100);
  }

  focusNextCommentInput(currentPost: any) {
    // Find the index of the current post
    const postIndex = this.samplePosts.findIndex(p => p.id === currentPost.id);
    
    // If there's a next post, attempt to focus its comment input
    if (postIndex < this.samplePosts.length - 1) {
      const nextPost = this.samplePosts[postIndex + 1];
      // You might need to implement a method to programmatically focus the next comment input
      console.log('Focusing next post comment input');
    }
  }

  toggleReplyInput(comment: any) {
    comment.showReplyInput = !comment.showReplyInput;
    if (!comment.showReplyInput) {
      this.currentReplyText = '';
    }
  }

  addReply(comment: any, replyText: string) {
    if (!replyText.trim()) return;

    const reply: any = {
      id: this.generateUniqueId(),
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

  deleteReply(comment: any, replyIndex: number) {
    if (comment.replies) {
      comment.replies.splice(replyIndex, 1);
    }
  }

  pinPost(post: any) {
    post.isPinned = !post.isPinned;
    if (post.isPinned) {
      const index = this.samplePosts.indexOf(post);
      if (index > -1) {
        this.samplePosts.splice(index, 1);
        this.samplePosts.unshift(post);
      }
    }
    this.filterPostsByCategory(this.activeCategory);
  }

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.postSubscription = this.postService.getPosts().subscribe(posts => {
      this.samplePosts = posts;
      this.filterPostsByCategory(this.activeCategory);
      
      // Initialize dropdowns after posts are loaded
      setTimeout(() => {
        const dropdownElements = document.querySelectorAll('[data-bs-toggle="dropdown"]');
        dropdownElements.forEach(element => {
          new Dropdown(element);
        });
      }, 0);
    });
  }

  ngOnDestroy() {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }
}