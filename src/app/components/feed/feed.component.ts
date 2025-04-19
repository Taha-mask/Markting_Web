import { Component, HostListener, ViewChild, ElementRef, OnInit, Inject, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { RouterModule } from '@angular/router';
import { PostService } from '../services/post.service';
import { TrendingSidebarComponent } from '../trending-sidebar/trending-sidebar.component';
import { User } from '../../interfaces/user';
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
  isEditing?: boolean;
  editText?: string;
  editHistory?: { text: string; editedBy: string; timestamp: Date }[];
  lastEditedBy?: string;
  isLikedByCurrentUser?: boolean;
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
  providers: [DatePipe, PostService],
})
export class FeedComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild(TrendingSidebarComponent) trendingSidebar!: TrendingSidebarComponent;
  @ViewChildren('commentContainer') commentContainers!: QueryList<ElementRef>;
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

  constructor(@Inject(PostService) private postService: PostService) {}

  ngOnInit() {
    this.postService.getPosts().subscribe((updatedPosts: Post[]) => {
      this.posts = updatedPosts;
    });
    this.filterPostsByCategory('All');
    this.postSubscription = this.postService.getPosts().subscribe(
      (updatedPosts: Post[]) => {
        this.posts = updatedPosts;
      },
      (error) => {
        console.error('Error fetching posts', error);
      }
    );
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

  subCategories: any[] = [];
  activeSubCategory: string = '';

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

  formatCategoryName(name: string): string {
    return name.replace('&', '<br>&');
  }

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

  filteredPosts: Post[] = [];

  filterPostsByCategory(categoryName: string) {
    this.activeCategory = categoryName;
    if (categoryName === 'All') {
      this.filteredPosts = this.posts;
    } else {
      this.filteredPosts = this.posts.filter(post => post.category === categoryName);
    }
  }

  filterPostsBySubCategory(subCategoryName: string) {
    this.activeSubCategory = subCategoryName;
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
      const newPost: Post = {
        username: this.user[0].username,
        profileImageUrl: this.user[0].profileImageUrl,
        timestamp: new Date(),
        content: this.postContent,
        category: 'General',
        images: [],
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
      this.posts.unshift(newPost);
      this.postContent = '';
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

  editComment(comment: Comment) {
    this.resetAllEditingStates();
    comment.isEditing = true;
    comment.editText = comment.text;
  }

  saveCommentEdit(comment: Comment) {
    if (comment.editText && comment.editText.trim()) {
      if (!comment.editHistory) {
        comment.editHistory = [];
      }
      if (comment.editText.trim() !== comment.text) {
        comment.editHistory.push({
          text: comment.text,
          editedBy: this.currentUser,
          timestamp: new Date()
        });
        if (comment.editHistory.length > 5) {
          comment.editHistory.shift();
        }
        comment.text = comment.editText.trim();
        comment.lastEditedBy = this.currentUser;
      }
    }
    comment.isEditing = false;
    comment.editText = undefined;
  }

  cancelCommentEdit(comment: Comment) {
    comment.isEditing = false;
    comment.editText = undefined;
  }

  restoreCommentVersion(comment: Comment, event: Event) {
    const target = event.target as HTMLSelectElement;
    if (!target) {
      console.warn('Event target is null');
      return;
    }

    const versionIndex = parseInt(target.value, 10);

    if (
      comment.editHistory &&
      !isNaN(versionIndex) &&
      versionIndex >= 0 &&
      versionIndex < comment.editHistory.length
    ) {
      const restoredVersion = comment.editHistory[versionIndex];
      comment.text = restoredVersion.text;
      comment.isEditing = false;
    }
  }

  private resetAllEditingStates() {
    this.posts.forEach((post: Post) => {
      post.comments.forEach((c: Comment) => {
        c.isEditing = false;
        c.editText = undefined;
        c.replies?.forEach((reply: Comment) => {
          reply.isEditing = false;
          reply.editText = undefined;
        });
      });
    });
  }

  editReply(reply: Comment) {
    reply.isEditing = true;
    reply.editText = reply.text;
  }

  saveReplyEdit(reply: Comment) {
    if (reply.editText && reply.editText.trim()) {
      reply.text = reply.editText.trim();
    }
    reply.isEditing = false;
  }

  cancelReplyEdit(reply: Comment) {
    reply.isEditing = false;
    reply.editText = undefined;
  }

  toggleCommentLike(comment: Comment) {
    comment.isLikedByCurrentUser = !comment.isLikedByCurrentUser;
    comment.likes += comment.isLikedByCurrentUser ? 1 : -1;
  }

  isCommentLikedByCurrentUser(comment: Comment): boolean {
    return comment.isLikedByCurrentUser || false;
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
    this.subCategories = [];
    this.filterPostsByCategory('All');
  }

  showSubCategories(category: any) {
    this.activeCategory = category.name;
    this.subCategories = this.getSubCategories(category.name);
  }

  getSubCategories(categoryName: string): any[] {
    const subCategories = [
      { name: 'All', icon: 'bi bi-collection' }
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
    this.filteredPosts = this.posts
      .sort((a, b) => (b.likes + b.comments.length + b.Shares) - (a.likes + a.comments.length + a.Shares));
  }

  filterByRecent() {
    this.filteredPosts = this.posts
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

  showCommentLikes(comment: Comment) {
    comment.showLikedBy = !comment.showLikedBy;
  }

  private generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  addComment(post: Post, commentText: string) {
    if (!commentText || commentText.trim() === '') return;

    const newComment: Comment = {
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

  scrollToLastComment(post: Post) {
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

  focusNextCommentInput(currentPost: Post) {
    // Find the index of the current post
    const postIndex = this.posts.findIndex(p => p.id === currentPost.id);
    
    // If there's a next post, attempt to focus its comment input
    if (postIndex < this.posts.length - 1) {
      const nextPost = this.posts[postIndex + 1];
      // You might need to implement a method to programmatically focus the next comment input
      console.log('Focusing next post comment input');
    }
  }

  toggleReplyInput(comment: Comment) {
    comment.showReplyInput = !comment.showReplyInput;
    if (!comment.showReplyInput) {
      this.currentReplyText = '';
    }
  }

  addReply(comment: Comment, replyText: string) {
    if (!replyText.trim()) return;

    const reply: Comment = {
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

  deleteReply(comment: Comment, replyIndex: number) {
    if (comment.replies) {
      comment.replies.splice(replyIndex, 1);
    }
  }

  private postSubscription: Subscription | null = null;

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

 
  }

