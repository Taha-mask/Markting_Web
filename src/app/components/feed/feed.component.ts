import { Component, HostListener, ViewChild, ElementRef, OnInit, Inject, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { Post, Comment } from '../../interfaces/post';
import { RouterModule } from '@angular/router';
import { PostService } from '../../services/post.service';
import { TrendingSidebarComponent } from '../trending-sidebar/trending-sidebar.component';
import { User } from '../../interfaces/user';
import { Subscription } from 'rxjs';
import { Dropdown } from 'bootstrap';
import {FooterComponent} from '../footer/footer.component';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    imports: [CommonModule, RouterModule, FormsModule, PickerModule, TrendingSidebarComponent, FooterComponent],
    templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.css'],
    providers: [DatePipe]
})
export class FeedComponent implements OnInit, OnDestroy {
  // Safe accessor methods for document properties
  getCurrentMedia(post: Post): any {
    if (!post || !post.media || post.currentImageIndex === undefined || post.currentImageIndex < 0 || !post.media[post.currentImageIndex]) {
      return null;
    }
    return post.media[post.currentImageIndex];
  }

  getMediaCurrentPage(post: Post): number {
    const currentMedia = this.getCurrentMedia(post);
    return currentMedia?.currentPage || 0;
  }

  getMediaPagesLength(post: Post): number {
    const currentMedia = this.getCurrentMedia(post);
    return currentMedia?.pages?.length || 0;
  }

  getMediaZoom(post: Post): number {
    const currentMedia = this.getCurrentMedia(post);
    return currentMedia?.zoom || 1;
  }

  isMediaZoomMaxReached(post: Post): boolean {
    return this.getMediaZoom(post) >= 2;
  }

  isMediaZoomMinReached(post: Post): boolean {
    return this.getMediaZoom(post) <= 0.5;
  }
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild(TrendingSidebarComponent) trendingSidebar!: TrendingSidebarComponent;
  @ViewChildren('commentContainer') commentContainers!: QueryList<ElementRef>;
  isDropdownVisible = false;
  postContent: string = '';
  filteredPosts: Post[] = [];
  user: any[] = [
    {
      username: 'Taha Mahmoud',
      profileImageUrl: 'assets/images/profile.jpg'
    }
  ];
  currentUser = 'Taha Mahmoud';
  activeCategory: string = 'All';
  activeSubCategory: string = '';
  subCategories: { name: string; icon: string }[] = [];
  navbarVisible = true;
  lastScrollTop = 0;
  private startX = 0;
  private scrollLeft = 0;
  private isDragging = false;
  selectedPost: Post | null = null;
  postUrl: string = '';
  linkCopied: boolean = false;
  currentReplyText: string = '';
  showEmojiPicker: boolean = false;
  newComment: string = '';
  private postSubscription: Subscription | null = null;

  // Document viewer properties
  currentPage: number = 1;
  totalPages: number = 1;
  currentZoom: number = 1;
  isDocumentLoading: boolean = false;
  activeDocument: any = null;

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
  selectedImage: string = '';

  formatCategoryName(name: string): string {
    return name.replace(/&/g, '<br>&');
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

  getSubCategories(categoryName: string): { name: string; icon: string }[] {
    const subCategoriesMap: { [key: string]: string[] } = {
      'All': ['All Categories'],
      'Electrical Tools': ['All', 'Power Tools', 'Hand Tools', 'Measuring Tools', 'Safety Equipment'],
      'Food': ['All', 'Restaurants', 'Recipes', 'Groceries', 'Delivery', 'Snacks', 'Beverages'],
      'Medicines': ['All', 'Prescription', 'Over-the-counter', 'Supplements', 'First Aid', 'Vitamins'],
      'Electronics': ['All', 'Phones', 'Laptops', 'Tablets', 'Accessories', 'Smart Home', 'Cameras'],
      'Clothing': ['All', 'Men', 'Women', 'Kids', 'Accessories', 'Sportswear', 'Formal Wear'],
      'Fashion': ['All', 'Trends', 'Accessories', 'Shoes', 'Bags', 'Jewelry', 'Watches'],
      'Home & Kitchen': ['All', 'Appliances', 'Furniture', 'Decor', 'Cookware', 'Storage', 'Lighting'],
      'Beauty & Personal Care': ['All', 'Skincare', 'Makeup', 'Hair Care', 'Fragrance', 'Bath & Body', 'Tools'],
      'Home Appliances': ['All', 'Kitchen', 'Laundry', 'Cleaning', 'Climate Control', 'Entertainment'],
      'Sports & Fitness': ['All', 'Equipment', 'Apparel', 'Supplements', 'Training', 'Outdoor', 'Team Sports'],
      'Video Games': ['All', 'Console Games', 'PC Games', 'Mobile Games', 'Accessories', 'Virtual Reality'],
      'Toys & Hobbies': ['All', 'Action Figures', 'Board Games', 'Crafts', 'Educational', 'Remote Control'],
      'Auto Parts': ['All', 'Engine Parts', 'Exterior', 'Interior', 'Accessories', 'Tools', 'Maintenance'],
      'Groceries': ['All', 'Fresh Food', 'Pantry', 'Beverages', 'Snacks', 'Organic', 'International'],
      'Health & Personal Care': ['All', 'Vitamins', 'Personal Care', 'Health Monitors', 'First Aid', 'Wellness'],
      'Books & Media': ['All', 'Books', 'Movies', 'Music', 'Games', 'Magazines', 'Educational'],
      'Pet Supplies': ['All', 'Dog Supplies', 'Cat Supplies', 'Fish Supplies', 'Bird Supplies', 'Small Pets'],
      'Perfumes': ['All', 'Women\'s Perfumes', 'Men\'s Perfumes', 'Unisex', 'Gift Sets', 'Luxury']
    };

    return (subCategoriesMap[categoryName] || []).map(name => {
      return {
        name: name,
      icon: this.getIconForSubCategory(name)
      };
    });
  }

  getIconForSubCategory(name: string): string {
    const iconMap: { [key: string]: string } = {
      'All': 'bi bi-collection',
      'All Categories': 'bi bi-collection',
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
      'Power Tools': 'bi bi-tools',
      'Hand Tools': 'bi bi-wrench',
      'Measuring Tools': 'bi bi-rulers',
      'Safety Equipment': 'bi bi-shield-check',
      'Smart Home': 'bi bi-house-gear',
      'Cameras': 'bi bi-camera',
      'Sportswear': 'bi bi-person-walking',
      'Formal Wear': 'bi bi-suit-heart',
      'Jewelry': 'bi bi-gem',
      'Watches': 'bi bi-watch',
      'Storage': 'bi bi-box-seam',
      'Lighting': 'bi bi-lamp',
      'Bath & Body': 'bi bi-droplet',
      'Tools': 'bi bi-tools',
      'Kitchen': 'bi bi-cup-hot',
      'Laundry': 'bi bi-water',
      'Cleaning': 'bi bi-brush',
      'Climate Control': 'bi bi-thermometer-half',
      'Entertainment': 'bi bi-tv',
      'Outdoor': 'bi bi-tree',
      'Team Sports': 'bi bi-people-fill',
      'Console Games': 'bi bi-controller',
      'PC Games': 'bi bi-pc-display',
      'Mobile Games': 'bi bi-phone-fill',
      'Virtual Reality': 'bi bi-badge-vr',
      'Action Figures': 'bi bi-person-arms-up',
      'Board Games': 'bi bi-dice-6',
      'Crafts': 'bi bi-palette',
      'Educational': 'bi bi-book-half',
      'Remote Control': 'bi bi-robot',
      'Engine Parts': 'bi bi-gear',
      'Exterior': 'bi bi-car-front',
      'Interior': 'bi bi-car-front-fill',
      'Maintenance': 'bi bi-tools',
      'Fresh Food': 'bi bi-egg-fried',
      'Pantry': 'bi bi-basket',
      'Organic': 'bi bi-flower1',
      'International': 'bi bi-globe',
      'Health Monitors': 'bi bi-activity',
      'Wellness': 'bi bi-heart-pulse',
      'Magazines': 'bi bi-newspaper',
      'Dog Supplies': 'bi bi-heart',
      'Cat Supplies': 'bi bi-heart-fill',
      'Fish Supplies': 'bi bi-water',
      'Bird Supplies': 'bi bi-feather',
      'Small Pets': 'bi bi-heart-half',
      'Women\'s Perfumes': 'bi bi-flower2',
      'Men\'s Perfumes': 'bi bi-flower1',
      'Unisex': 'bi bi-gender-ambiguous',
      'Gift Sets': 'bi bi-gift'
    };
    return iconMap[name] || 'bi bi-tag';
  }

  filterPostsByCategory(categoryName: string) {
    this.activeCategory = categoryName;
    this.activeSubCategory = '';  // Reset sub-category when changing category

    if (categoryName === 'All') {
      this.filteredPosts = [...this.posts].sort((a, b) =>
        (b.timestamp as any) - (a.timestamp as any)
      );
    } else {
      this.subCategories = this.getSubCategories(categoryName);
      this.filteredPosts = this.posts
        .filter(post => post.category === categoryName)
        .sort((a, b) => (b.timestamp as any) - (a.timestamp as any));
    }
  }

  filterPostsBySubCategory(subCategoryName: string) {
    this.activeSubCategory = subCategoryName;

    if (subCategoryName === 'All') {
      // Show all posts for the current category
      this.filterPostsByCategory(this.activeCategory);
    } else {
      this.filteredPosts = this.posts.filter(post =>
        post.category === this.activeCategory &&
        post.subCategory === subCategoryName
      ).sort((a, b) => (b.timestamp as any) - (a.timestamp as any));
    }
  }

  // Posts data - initialized as empty array, will be populated from API
  posts: Post[] = [];

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

  toggleLike(post: Post) {
    // Update UI immediately for better user experience
    post.liked = !post.liked;
    post.likes = (post.likes || 0) + (post.liked ? 1 : -1);

    // Call API to update like status
    this.postService.likePost(post.id).subscribe({
      next: (updatedPost: Post | null) => {
        if (updatedPost) {
          console.log('Post like status updated successfully');
          const index = this.posts.findIndex((p: Post) => p.id === post.id);
          if (index !== -1) {
            // Preserve the UI state for liked status
            const wasLiked = this.posts[index].liked;
            this.posts[index] = updatedPost;
            this.posts[index].liked = wasLiked;
            this.filterPostsByCategory(this.activeCategory);
          }
        }
      },
      error: (error: any) => {
        console.error('Error liking post:', error);
        // Revert UI changes if API call fails
        post.liked = !post.liked;
        post.likes = (post.likes || 0) - (post.liked ? 1 : -1);
      }
    });
  }

  toggleComments(post: Post) {
    post.showComments = !post.showComments;
  }

  sharePost(post: Post) {
    // Validate post and post.id before proceeding
    if (!post) {
      console.error('Cannot share undefined post');
      return;
    }

    // Use post.id directly as a string
    const postId = post.id;

    if (!postId) {
      console.error('Invalid post ID for sharing:', post.id);
      return;
    }

    this.postService.sharePost(postId).subscribe({
      next: (updatedPost: Post | null) => {
        if (updatedPost) {
          // Update post in posts array
          const postsIndex = this.posts.findIndex((p: Post) => p.id === updatedPost.id);
          if (postsIndex !== -1) {
            this.posts[postsIndex] = updatedPost;
          }

          // Update post in filteredPosts array
          const filteredIndex = this.filteredPosts.findIndex((p: Post) => p.id === postId);
          if (filteredIndex !== -1) {
            this.filteredPosts[filteredIndex] = updatedPost;
          }
        }

        // Apply category filter to refresh the view
        this.filterPostsByCategory(this.activeCategory);

        // Set selected post and prepare share URL
        this.selectedPost = updatedPost;
        this.postUrl = `${window.location.origin}/post/${postId}`;

        // Show the share modal
        const modal = document.getElementById('shareModal');
        if (modal) {
          const bootstrapModal = new bootstrap.Modal(modal);
          bootstrapModal.show();
        }
      },
      error: (error: any) => {
        console.error('Error sharing post:', error);
      }
    });
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
          this.selectedImage = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  addPost() {
    if (this.postContent.trim()) {
      const newPost: Post = {
        id: '', // Will be set by the backend
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

      this.postService.createPost(newPost).subscribe({
        next: (createdPost: Post) => {
          this.posts.unshift(createdPost);
          this.postContent = '';
          this.filterPostsByCategory(this.activeCategory);
        },
        error: (error: any) => {
          console.error('Error creating post:', error);
        }
      });
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

  toggleSave(post: Post) {
    post.saved = !post.saved;
    post.Saves = (post.Saves || 0) + (post.saved ? 1 : -1);
  }

  nextImage(post: Post) {
    if (post.media && post.currentImageIndex !== undefined && post.currentImageIndex < post.media.length - 1) {
      post.currentImageIndex++;
    }
  }

  prevImage(post: Post) {
    if (post.currentImageIndex !== undefined && post.currentImageIndex > 0) {
      post.currentImageIndex--;
    }
  }

  deleteComment(post: Post, commentIndex: number) {
    if (post.comments && post.comments.length > commentIndex) {
      post.comments.splice(commentIndex, 1);
    }
  }

  toggleCommentLike(comment: any): void {
    // Check if the comment is already liked by the current user
    const isLiked = this.isCommentLikedByCurrentUser(comment);

    if (isLiked) {
      // If already liked, call the unlike service method
      // TODO: Implement actual API call for unlikeComment in PostService
      // Example: this.postService.unlikeComment(comment.id).subscribe({
      //   next: (updatedComment) => {
      //     // Update local state based on the backend response
      //     comment.likedBy = updatedComment.likedBy || [];
      //     comment.likes = updatedComment.likes || 0;
      //     comment.isLikedByCurrentUser = this.isCommentLikedByCurrentUser(comment);
      //     console.log('Comment unliked successfully', updatedComment);
      //   },
      //   error: (error) => {
      //     console.error('Error unliking comment', error);
      //     // Optionally, revert local changes or show an error message
      //   }
      // });

      // Temporary local update for immediate feedback (remove or adjust after implementing backend call)
      if (comment.likedBy) {
        comment.likedBy = comment.likedBy.filter((user: string) => user !== this.currentUser);
      }
      comment.likes = Math.max(0, (comment.likes || 0) - 1);
      comment.isLikedByCurrentUser = false;

    } else {
      // If not liked, call the like service method
      // TODO: Implement actual API call for likeComment in PostService
      // Example: this.postService.likeComment(comment.id).subscribe({
      //   next: (updatedComment) => {
      //     // Update local state based on the backend response
      //     if (!updatedComment.likedBy) updatedComment.likedBy = [];
      //     comment.likedBy = updatedComment.likedBy;
      //     comment.likes = updatedComment.likes || 0;
      //     comment.isLikedByCurrentUser = this.isCommentLikedByCurrentUser(comment);
      //     console.log('Comment liked successfully', updatedComment);
      //   },
      //   error: (error) => {
      //     console.error('Error liking comment', error);
      //     // Optionally, revert local changes or show an error message
      //   }
      // });

       // Temporary local update for immediate feedback (remove or adjust after implementing backend call)
       if (!comment.likedBy) {
        comment.likedBy = [];
      }
      comment.likedBy.push(this.currentUser);
      comment.likes = (comment.likes || 0) + 1;
      comment.isLikedByCurrentUser = true;
    }

    // Note: The state updates should ideally happen in the .subscribe block after a successful API call.
    // The local updates above are for immediate UI feedback but might need adjustment.
  }

  isCommentLikedByCurrentUser(comment: any): boolean {
    // Check both the isLikedByCurrentUser property and the likedBy array
    return (
      comment.isLikedByCurrentUser ||
      (comment.likedBy && Array.isArray(comment.likedBy) && comment.likedBy.includes(this.currentUser))
    );
  }

  likeComment(comment: any): void {
    this.toggleCommentLike(comment);
  }

  dislikeComment(comment: any): void {
    if (!comment.isDisliked) {
      comment.dislikes = (comment.dislikes || 0) + 1;
      comment.isDisliked = true;
    }
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
    comment.isEditing = false;
    comment.editText = undefined;
    }
  }

  cancelCommentEdit(comment: any) {
    comment.isEditing = false;
    comment.editText = undefined;
  }

  restoreCommentVersion(comment: any, event: Event) {
    const target = event.target as HTMLSelectElement;
    if (!target) {
      return;
    }

    const selectedIndex = parseInt(target.value);
    if (comment.editHistory && comment.editHistory[selectedIndex]) {
      const version = comment.editHistory[selectedIndex];
      comment.text = version.text;
      comment.lastEditedBy = version.editedBy;
    }
  }

  private resetAllEditingStates() {
    // Process both filteredPosts and posts
    const allPosts = [...this.filteredPosts, ...this.posts];

    allPosts.forEach((post: Post) => {
      // Ensure post.comments exists before processing
      if (post.comments && post.comments.length > 0) {
        post.comments.forEach((c: any) => {
          c.isEditing = false;
          c.editText = undefined;
          // Ensure replies exists before processing
          if (c.replies && c.replies.length > 0) {
            c.replies.forEach((reply: any) => {
              reply.isEditing = false;
              reply.editText = undefined;
            });
          }
        });
      }
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

  // Comment like functionality is now handled by the enhanced implementation above

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
    // Use post.id directly as a string
    const postId = post.id;
    this.postService.deletePost(postId).subscribe({
      next: () => {
        const index = this.posts.findIndex((p: Post) => p.id === post.id);
        if (index !== -1) {
          this.posts.splice(index, 1);
          this.filterPostsByCategory(this.activeCategory);
        }
      },
      error: (error: any) => {
        console.error('Error deleting post:', error);
      }
    });
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

  shareViaMessage(post: Post) {
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
    this.filteredPosts = [...this.posts]
      .sort((a: Post, b: Post) => ((b.likes || 0) + (b.comments?.length || 0) + (b.Shares || 0)) - ((a.likes || 0) + (a.comments?.length || 0) + (a.Shares || 0)));
  }

  filterByRecent() {
    this.filteredPosts = [...this.posts]
      .sort((a: Post, b: Post) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
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

  showReactionUsers(post: Post) {
    post.showReactionUsers = !post.showReactionUsers;
  }
  // Method to toggle reply input visibility
  toggleReplyInput(comment: any): void {
    comment.showReplyInput = !comment.showReplyInput;

    // If showing reply input, focus it after a short delay to allow for DOM update
    if (comment.showReplyInput) {
      setTimeout(() => {
        const replyInput = document.querySelector(`#reply-input-${comment.id}`) as HTMLTextAreaElement;
        if (replyInput) {
          replyInput.focus();
        }
      }, 100);
    }
  }

  // Method to add a reply to a comment
  addReply(comment: any, replyText: string): void {
    if (!replyText || !replyText.trim()) {
      return;
    }

    // Prepare the reply data to send to the backend
    const replyDataToSend = {
      commentId: comment.id, // Assuming comment has an ID
      content: replyText.trim(),
      // You might need to add other fields here like userId
      // The backend should ideally get username and profileImageUrl from the authenticated user
    };

    // Call the backend service to add the reply
    // TODO: Implement this method in your PostService
    this.postService.addReplyToBackend(replyDataToSend).subscribe({
      next: (savedReplyFromBackend: any) => {
        // Find the comment in filteredPosts array (to update its replies)
        const postInFiltered = this.filteredPosts.find(p => p.id === comment.postId); // Assuming comment has postId

        if (postInFiltered) {
          // Ensure comments array exists before finding the comment
          if (postInFiltered.comments) {
            const commentInPost = postInFiltered.comments.find((c: any) => c.id === comment.id);

            if (commentInPost) {
              if (!commentInPost.replies) {
                commentInPost.replies = [];
              }

              // Use the reply object returned from the backend
              commentInPost.replies.push(savedReplyFromBackend);

              // Scroll to the newly added reply
              this.scrollToLastReply(commentInPost); // Scroll to the updated comment's replies
            }
          }
        }

        // Reset the reply input
        this.currentReplyText = '';

        // Toggle off the reply input
        comment.showReplyInput = false;
      },
      error: (error: any) => {
        console.error('Error adding reply to backend:', error);
        // Optionally, show an error message to the user
      }
    });
  }

  // Method to scroll to the last reply
  scrollToLastReply(comment: any): void {
    setTimeout(() => {
      try {
        const replyContainer = document.querySelector(`#replies-${comment.id}`);
        if (replyContainer) {
          const lastReply = replyContainer.lastElementChild;
          if (lastReply) {
            lastReply.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
             // If no last reply element found, scroll the comments container into view
            this.scrollToLastComment(comment);
          }
        }
      } catch (error) {
        console.error('Error scrolling to reply:', error);
      }
    }, 100);
  }

  showCommentLikes(comment: any) {
    comment.showLikedBy = !comment.showLikedBy;
  }

  generateUniqueId(): number {
    return Math.floor(Math.random() * 1000000); // Simple client-side ID, replace with backend generated ID
  }

  /**
   * Generate a reaction ID based on post ID and reaction type
   * @param postId The ID of the post
   * @param reactionType The type of reaction
   * @returns A unique reaction ID string
   */
  generateReactionId(postId: string, reactionType: string): string {
    return `${postId}_${reactionType}_${this.currentUser}`;
  }

  addComment(post: Post, commentText: string) {
    if (commentText.trim()) {
      const postId = post.id;

      // Prepare the comment data to send to the backend
      const commentDataToSend = {
        postId: postId,
        content: commentText.trim(),
        // You might need to add other fields here like userId
        // The backend should ideally get username and profileImageUrl from the authenticated user
      };

      // Call the backend service to add the comment
      this.postService.addCommentToBackend(commentDataToSend).subscribe({
        next: (savedCommentFromBackend: any) => {
          // Find the post in filteredPosts array
          const postInFiltered = this.filteredPosts.find(p => p.id === post.id);

          if (postInFiltered) {
            if (!postInFiltered.comments) {
              postInFiltered.comments = [];
            }

            // Use the comment object returned from the backend
            // Add the new comment returned from the backend to the comments array
            postInFiltered.comments.push(savedCommentFromBackend);

            // Scroll to the new comment
            this.scrollToLastComment(post);

            // Reset the comment input
            this.newComment = '';
          }
        },
        error: (error: any) => {
          console.error('Error adding comment to backend:', error);
          // Optionally, show an error message to the user
        }
      });
    }
  }

  scrollToLastComment(post: Post) {
    // Use setTimeout to ensure DOM has updated
    setTimeout(() => {
      try {
        // Check if post has comments before trying to access them
        if (!post.comments || post.comments.length === 0) return;

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

  focusNextCommentInput(currentPost: Post) {
    // Find the index of the current post
    const postIndex = this.posts.findIndex((p: Post) => p.id === currentPost.id);

    // If there's a next post, attempt to focus its comment input
    if (postIndex < this.posts.length - 1) {
      const nextPost = this.posts[postIndex + 1];
      // You might need to implement a method to programmatically focus the next comment input
      console.log('Focusing next post comment input');
    }
  }

  onTrendingFeedClick(feed: TrendingFeed) {
    if (feed.link) {
      window.open(feed.link, '_blank');
    } else {
      console.log('Clicked on trending feed:', feed.title);
    }
  }

  deleteReply(comment: any, replyIndex: number) {
    if (comment.replies && comment.replies.length > replyIndex) {
      const replyToDelete = comment.replies[replyIndex];
      // TODO: Call backend service to delete the reply
      // Example: this.postService.deleteReplyFromBackend(replyToDelete.id).subscribe({
      //   next: () => {
      //     // On successful backend deletion, remove locally
      //     comment.replies.splice(replyIndex, 1);
      //     console.log('Reply deleted successfully from backend and UI');
      //   },
      //   error: (error) => {
      //     console.error('Error deleting reply from backend:', error);
      //     // Optionally, show an error message to the user
      //   }
      // });

      // Temporary local deletion for immediate feedback (remove or adjust after implementing backend call)
      comment.replies.splice(replyIndex, 1);
      console.log('Reply deleted locally');
    }
  }

  pinPost(post: Post) {
    // Toggle the pinned status locally for immediate feedback
    post.isPinned = !post.isPinned;

    // TODO: Call backend service to update the pinned status
    // Example: this.postService.updatePostPinnedStatus(post.id, post.isPinned).subscribe({
    //   next: (updatedPost) => {
    //     // Update the post in the local arrays based on the backend response
    //     const indexFiltered = this.filteredPosts.findIndex(p => p.id === updatedPost.id);
    //     if (indexFiltered !== -1) { this.filteredPosts[indexFiltered] = updatedPost; }
    //     const indexPosts = this.posts.findIndex(p => p.id === updatedPost.id);
    //     if (indexPosts !== -1) { this.posts[indexPosts] = updatedPost; }
    //     console.log('Post pinned status updated successfully from backend');
    //   },
    //   error: (error) => {
    //     console.error('Error updating post pinned status on backend:', error);
    //     // Optionally, revert the local change or show an error message
    //     post.isPinned = !post.isPinned; // Revert local change on error
    //   }
    // });

    // Local logic for reordering pinned posts (can be adjusted based on backend behavior)
    if (post.isPinned) {
      const index = this.posts.indexOf(post);
      if (index > -1) {
        this.posts.splice(index, 1);
        this.posts.unshift(post);
      }
    }
    this.filterPostsByCategory(this.activeCategory);
     // TODO: Call backend service to pin/unpin the post
  }

  sendOrderRequest(post: Post): void {
    // Example logic: Display an alert or send a request to the backend
    console.log(`Order request sent for post by ${post.username}`);
    alert(`Order request sent for post by ${post.username}`);

    // Add your backend API call logic here if needed
    // Example:
    // this.http.post('/api/order', { postId: post.id }).subscribe(response => {
    //   console.log('Order request successful:', response);
    // });
  }

  sendMessage(user: any): void {
    // TODO: Implement message functionality
    console.log('Opening message dialog with user:', user.name);
    // You can implement the actual messaging functionality here
    // For example, navigate to a chat page or open a message dialog
  }

  constructor(private postService: PostService, private datePipe: DatePipe, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadPosts();

    // Subscribe to new posts
    this.postSubscription = this.postService.posts$.subscribe(posts => {
      if (posts && posts.length > 0) {
        console.log('Received updated posts:', posts.length);
        this.posts = posts;
        this.filterPostsByCategory(this.activeCategory);
      }
    });
  }

  loadPosts() {
    this.postService.getPosts().subscribe({
      next: (posts: Post[]) => {
        console.log('Initial posts loaded:', posts.length);
        this.posts = posts;
        this.filterPostsByCategory(this.activeCategory);
      },
      error: (error: any) => {
        console.error('Error loading posts:', error);
      }
    });
  }

  ngOnDestroy() {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }

  toggleMenu() {
    const menu = document.getElementById('menuList');
    if (menu) {
      menu.toggleAttribute('hidden');
    }
  }

  toggleForm() {
    const form = document.getElementById('popupForm');
    if (form) {
      form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }
  }

  submitOrder(event: Event) {
    event.preventDefault();

    const customerInput = document.getElementById('popupCustomer') as HTMLInputElement;
    const amountInput = document.getElementById('popupAmount') as HTMLInputElement;
    const statusSelect = document.getElementById('popupStatus') as HTMLSelectElement;

    const customer = customerInput.value.trim();
    const amount = amountInput.value;
    const status = statusSelect.value;

    if (!customer || !amount || !status) return;

    if (status === 'cancelled') {
      this.toggleForm();
      return; // لا يتم الحفظ إذا تم اختيار cancelled
    }

    const today = new Date().toISOString().slice(0, 10);
    const newOrder = {
      id: Date.now(),
      date: today,
      customer,
      amount,
      status
    };

    const existingOrders = localStorage.getItem('orders');
    const orders = existingOrders ? JSON.parse(existingOrders) : [];

    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));

    // إخفاء الفورم وتفريغ الحقول
    customerInput.value = '';
    amountInput.value = '';
    statusSelect.value = 'pending';
    this.toggleForm();

    // يمكننا إعادة التوجيه لصفحة الطلبات
    this.router.navigate(['/orders']);
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getDocumentIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'bi bi-file-pdf text-danger';
      case 'doc':
      case 'docx':
        return 'bi bi-file-word text-primary';
      case 'xls':
      case 'xlsx':
        return 'bi bi-file-excel text-success';
      case 'ppt':
      case 'pptx':
        return 'bi bi-file-ppt text-warning';
      case 'txt':
        return 'bi bi-file-text text-info';
      default:
        return 'bi bi-file-earmark text-secondary';
    }
  }

  viewDocument(url: string): void {
    window.open(url, '_blank');
  }

  // تحسين وظيفة تشغيل الفيديو
  onVideoLoad(event: Event): void {
    const video = event.target as HTMLVideoElement;
    video.addEventListener('loadedmetadata', () => {
      // تعيين جودة الفيديو المناسبة
      if (video.videoHeight > 720) {
        video.style.maxHeight = '720px';
      }
    });

    // تحسين أداء الفيديو
    video.addEventListener('canplay', () => {
      video.play().catch(() => {
        // التعامل مع الأخطاء المحتملة عند التشغيل التلقائي
        console.log('Autoplay prevented');
      });
    });

    // معالجة مشكلة التوقف في المنتصف
    video.addEventListener('stalled', () => {
      video.load(); // إعادة تحميل الفيديو
    });
  }

  // Document viewer methods
  nextPage(media: any): void {
    if (media.currentPage < media.pages?.length - 1) {
      media.currentPage++;
    }
  }

  prevPage(media: any): void {
    if (media.currentPage > 0) {
      media.currentPage--;
    }
  }

  zoomIn(media: any): void {
    if (!media.zoom) {
      media.zoom = 1;
    }
    media.zoom = Math.min(media.zoom + 0.2, 2);
  }

  zoomOut(media: any): void {
    if (!media.zoom) {
      media.zoom = 1;
    }
    media.zoom = Math.max(media.zoom - 0.2, 0.5);
  }

  private applyZoom(): void {
    const pages = document.querySelectorAll('.document-pages');
    pages.forEach((page: any) => {
      if (page.style) {
        page.style.transform = `scale(${this.currentZoom})`;
      }
    });
  }

  loadDocument(document: any): void {
    this.isDocumentLoading = true;
    this.activeDocument = document;

    // Simulate document loading - replace with actual document loading logic
    setTimeout(() => {
      this.totalPages = document.pages || 1;
      this.currentPage = 1;
      this.currentZoom = 1;
      this.isDocumentLoading = false;
    }, 1000);
  }

  /**
   * Opens a document in a new tab for viewing or downloading
   * @param media The media object containing the document URL
   */
  downloadDocument(media: any): void {
    if (media && media.url) {
      window.open(media.url, '_blank');
    } else {
      console.warn('No document URL available for download');
    }
  }

  // Method to toggle like on a reply
  toggleReplyLike(reply: any): void {
    // Check if the reply is already liked by the current user
    const isLiked = this.isReplyLikedByCurrentUser(reply);

    if (isLiked) {
      // If already liked, call the unlike service method
      // TODO: Implement actual API call for unlikeReply in PostService
      // Example: this.postService.unlikeReply(reply.id).subscribe({
      //   next: (updatedReply) => {
      //     // Update local state based on the backend response
      //     reply.likedBy = updatedReply.likedBy || [];
      //     reply.likes = updatedReply.likes || 0;
      //     console.log('Reply unliked successfully', updatedReply);
      //   },
      //   error: (error) => {
      //     console.error('Error unliking reply', error);
      //     // Optionally, revert local changes or show an error message
      //      if (reply.likedBy) {
      //        reply.likedBy.push(this.currentUser);
      //      }
      //      reply.likes = (reply.likes || 0) + 1;
      //   }
      // });

      // Temporary local update for immediate feedback (remove or adjust after implementing backend call)
      if (reply.likedBy) {
        reply.likedBy = reply.likedBy.filter((user: string) => user !== this.currentUser);
      }
      reply.likes = Math.max(0, (reply.likes || 0) - 1);

    } else {
      // If not liked, call the like service method
      // TODO: Implement actual API call for likeReply in PostService
      // Example: this.postService.likeReply(reply.id).subscribe({
      //   next: (updatedReply) => {
      //     // Update local state based on the backend response
      //      if (!updatedReply.likedBy) updatedReply.likedBy = [];
      //      reply.likedBy = updatedReply.likedBy;
      //      reply.likes = updatedReply.likes || 0;
      //      console.log('Reply liked successfully', updatedReply);
      //   },
      //   error: (error) => {
      //     console.error('Error liking reply', error);
      //     // Optionally, revert local changes or show an error message
      //     // Revert local changes if API call fails
      //     if (reply.likedBy) {
      //       reply.likedBy = reply.likedBy.filter((user: string) => user !== this.currentUser);
      //     }
      //     reply.likes = Math.max(0, (reply.likes || 0) - 1);
      //   }
      // });

      // Temporary local update for immediate feedback (remove or adjust after implementing backend call)
      if (!reply.likedBy) {
        reply.likedBy = [];
      }
      reply.likedBy.push(this.currentUser);
      reply.likes = (reply.likes || 0) + 1;
    }

    // Note: The state updates should ideally happen in the .subscribe block after a successful API call.
    // The local updates above are for immediate UI feedback but might need adjustment.
  }

  // Method to check if a reply is liked by the current user
  isReplyLikedByCurrentUser(reply: any): boolean {
    return reply.likedBy && Array.isArray(reply.likedBy) && reply.likedBy.includes(this.currentUser);
  }
}

