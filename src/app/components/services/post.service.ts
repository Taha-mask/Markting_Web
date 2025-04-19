import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  comments: any[];
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsSubject = new BehaviorSubject<Post[]>([]);

  constructor() {
    // Initialize with some sample posts if needed
    this.posts = this.getSamplePosts();
    this.postsSubject.next(this.posts);
  }

  // Method to get posts as an Observable
  getPosts(): Observable<Post[]> {
    return this.postsSubject.asObservable();
  }

  // Method to add a new post
  addPost(newPost: Post) {
    // Generate a unique ID (you might want to use a more robust method)
    newPost.id = `post_${Date.now()}`;
    
    // Add the new post to the beginning of the array
    this.posts.unshift(newPost);
    
    // Emit the updated posts
    this.postsSubject.next(this.posts);
  }

  // Method to get sample posts (can be replaced with API call)
  private getSamplePosts(): Post[] {
    return [
      {
        id: 'sample1',
        username: 'Taha Mahmoud',
        profileImageUrl: 'assets/images/user-1.png',
        timestamp: new Date(),
        content: 'Welcome to our marketing platform!',
        category: 'All',
        images: [],
        currentImageIndex: 0,
        likes: 0,
        Shares: 0,
        Saves: 0,
        showComments: false,
        isEditing: false,
        liked: false,
        saved: false,
        comments: []
      }
    ];
  }

  // Additional methods like deletePost, updatePost can be added here
}
