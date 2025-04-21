import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrendingSidebarComponent } from '../trending-sidebar/trending-sidebar.component';
import { trigger, transition, style, animate } from '@angular/animations';

interface SavedPost {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  timestamp: Date;
  username: string;
  userImage: string;
  category: string;
  price: number;
  likes: number;
  isLiked: boolean;
}

@Component({
  standalone: true,
  selector: 'app-saved-post',
  imports: [CommonModule, FormsModule, TrendingSidebarComponent],
  templateUrl: './saved-post.component.html',
  styleUrls: ['./saved-post.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ])
  ]
})
export class SavedPostComponent implements OnInit {
  savedPosts: SavedPost[] = [
    {
      id: 1,
      title: 'Modern Desk Setup',
      description: 'Complete workspace setup with ergonomic features.',
      imageUrl: 'images/post-image-1.png',
      timestamp: new Date(),
      username: 'Ahmed Ali',
      userImage: 'images/user-1.png',
      category: 'Electronics',
      price: 299.99,
      likes: 45,
      isLiked: false
    },
    {
      id: 2,
      title: 'Professional Camera Kit',
      description: 'DSLR camera with multiple lenses and accessories.',
      imageUrl: 'images/post-image-3.png',
      timestamp: new Date(),
      username: 'Sara Mohamed',
      userImage: 'images/user-2.png',
      category: 'Photography',
      price: 899.99,
      likes: 32,
      isLiked: true
    }
  ];

  searchQuery: string = '';
  selectedCategory: string = 'All';
  sortOption: string = 'newest';
  isLoading: boolean = false;
  showShareModal: boolean = false;
  selectedPost: SavedPost | null = null;

  categories: string[] = ['All', 'Electronics', 'Photography', 'Fashion', 'Home', 'Sports'];

  get filteredPosts(): SavedPost[] {
    return this.savedPosts
      .filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            post.description.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesCategory = this.selectedCategory === 'All' || post.category === this.selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (this.sortOption) {
          case 'newest':
            return b.timestamp.getTime() - a.timestamp.getTime();
          case 'oldest':
            return a.timestamp.getTime() - b.timestamp.getTime();
          case 'priceHigh':
            return b.price - a.price;
          case 'priceLow':
            return a.price - b.price;
          case 'mostLiked':
            return b.likes - a.likes;
          default:
            return 0;
        }
      });
  }

  deletePost(id: number) {
    this.isLoading = true;
    setTimeout(() => {
      this.savedPosts = this.savedPosts.filter(post => post.id !== id);
      this.isLoading = false;
    }, 500);
  }

  orderNow(post: SavedPost) {
    this.isLoading = true;
    // Simulating API call
    setTimeout(() => {
      alert(`Order placed for: ${post.title}\nTotal: $${post.price.toFixed(2)}`);
      this.isLoading = false;
    }, 1000);
  }

  toggleLike(post: SavedPost) {
    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;
  }

  sharePost(post: SavedPost) {
    this.selectedPost = post;
    this.showShareModal = true;
  }

  async copyLink(post: SavedPost) {
    const url = `${window.location.origin}/post/${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  }

  shareToSocial(platform: string) {
    if (!this.selectedPost) return;

    const url = encodeURIComponent(`${window.location.origin}/post/${this.selectedPost.id}`);
    const text = encodeURIComponent(`Check out this amazing post: ${this.selectedPost.title}`);

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  }

  closeShareModal() {
    this.showShareModal = false;
    this.selectedPost = null;
  }

  ngOnInit(): void {
    // Simulate loading state
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
}
