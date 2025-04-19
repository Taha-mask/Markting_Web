import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Post {
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
  isFollowing: boolean;
  comments: any[];
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts = new BehaviorSubject<Post[]>([]);
  posts$ = this.posts.asObservable();

  constructor() {
    // Initialize with sample data
    this.posts.next([
      {
        id: '1',
        username: 'Taha Mahmoud',
        profileImageUrl: 'assets/images/profile.jpg',
        timestamp: new Date(),
        content: 'Welcome to our community! 👋',
        category: 'General',
        subCategory: '',
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
      }
    ]);
  }

  // Get all posts
  getPosts(): Observable<Post[]> {
    return this.posts$;
  }

  // Add a new post
  addPost(post: Post): void {
    const currentPosts = this.posts.getValue();
    post.id = Date.now().toString();
    post.timestamp = new Date();
    post.showComments = false;
    post.isEditing = false;
    post.liked = false;
    post.saved = false;
    post.comments = [];
    
    // Add post to beginning of array
    this.posts.next([post, ...currentPosts]);
  }

  // Like a post
  likePost(postId: string): void {
    const currentPosts = this.posts.getValue();
    const updatedPosts = currentPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked
        };
      }
      return post;
    });
    this.posts.next(updatedPosts);
  }

  // Save a post
  savePost(postId: string): void {
    const currentPosts = this.posts.getValue();
    const updatedPosts = currentPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          Saves: post.saved ? post.Saves - 1 : post.Saves + 1,
          saved: !post.saved
        };
      }
      return post;
    });
    this.posts.next(updatedPosts);
  }

  // Add a comment to a post
  addComment(postId: string, comment: any): void {
    const currentPosts = this.posts.getValue();
    const updatedPosts = currentPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, comment]
        };
      }
      return post;
    });
    this.posts.next(updatedPosts);
  }

  // Delete a post
  deletePost(postId: string): void {
    const currentPosts = this.posts.getValue();
    const updatedPosts = currentPosts.filter(post => post.id !== postId);
    this.posts.next(updatedPosts);
  }

  // Filter posts by category
  filterByCategory(category: string): Post[] {
    const currentPosts = this.posts.getValue();
    if (category === 'All') {
      return currentPosts;
    }
    return currentPosts.filter(post => post.category === category);
  }

  // Filter posts by subcategory
  filterBySubCategory(category: string, subCategory: string): Post[] {
    const currentPosts = this.posts.getValue();
    return currentPosts.filter(post => 
      post.category === category && 
      post.subCategory === subCategory
    );
  }

  // Get trending posts (sorted by likes + comments + shares)
  getTrendingPosts(): Post[] {
    const currentPosts = this.posts.getValue();
    return [...currentPosts].sort((a, b) => 
      (b.likes + b.comments.length + b.Shares) - 
      (a.likes + a.comments.length + a.Shares)
    );
  }

  // Get recent posts (sorted by timestamp)
  getRecentPosts(): Post[] {
    const currentPosts = this.posts.getValue();
    return [...currentPosts].sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }
}
