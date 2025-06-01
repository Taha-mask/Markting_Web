import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrendingSidebarComponent } from '../trending-sidebar/trending-sidebar.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { PostService } from '../../services/post.service';
import { Post } from '../../interfaces/post';
import { Subscription } from 'rxjs';

@Component({
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
export class SavedPostComponent implements OnInit, OnDestroy {
  savedPosts: Post[] = [];
  searchQuery: string = '';
  selectedCategory: string = 'All';
  sortOption: string = 'newest';
  isLoading: boolean = false;
  showShareModal: boolean = false;
  selectedPost: Post | null = null;
  private subscription: Subscription = new Subscription();

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
    { name: 'Perfumes', icon: 'bi bi-flower1' }
  ];

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.subscription.add(
      this.postService.getSavedPosts().subscribe(posts => {
        this.savedPosts = posts;
        this.isLoading = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get filteredPosts(): Post[] {
    return this.savedPosts
      .filter(post => {
        const matchesSearch = post.content.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesCategory = this.selectedCategory === 'All' || post.category === this.selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (this.sortOption) {
          case 'newest':
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
          case 'oldest':
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          case 'priceHigh':
            return (b.price || 0) - (a.price || 0);
          case 'priceLow':
            return (a.price || 0) - (b.price || 0);
          case 'mostLiked':
            return (b.likes || 0) - (a.likes || 0);
          default:
            return 0;
        }
      });
  }

  deletePost(id: string) {
    this.isLoading = true;
    this.postService.removeSavedPost(id);
    this.isLoading = false;
  }

  toggleLike(post: Post) {
    post.liked = !post.liked;
    post.likes = (post.likes || 0) + (post.liked ? 1 : -1);
    this.postService.updatePost(post);
  }

  sharePost(post: Post) {
    this.selectedPost = post;
    this.showShareModal = true;
  }

  closeShareModal() {
    this.showShareModal = false;
    this.selectedPost = null;
  }

  async copyLink(post: Post) {
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
    const text = encodeURIComponent(`Check out this post: ${this.selectedPost.content}`);

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

  orderNow(post: Post) {
    this.isLoading = true;
    setTimeout(() => {
      alert(`Order placed for post by ${post.username}`);
      this.isLoading = false;
    }, 1000);
  }
}
