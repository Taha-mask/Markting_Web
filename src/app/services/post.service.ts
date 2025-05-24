import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, catchError, of } from 'rxjs';
import { Post } from '../interfaces/post';

// Import Comment interface from interfaces folder
import { Comment } from '../interfaces/post';

// Define reaction type interface
export interface Reaction {
  id: string;
  postId: string;
  userId: string;
  reactionType: string;
  timestamp: Date;
}

// Define top reactions interface
export interface TopReaction {
  reaction: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'https://brandit.runasp.net/api'; // TODO: Replace with your actual backend API URL
  private postApiUrl = `${this.apiUrl}/Post`;
  private commentApiUrl = `${this.apiUrl}/Comment`;
  private reactionApiUrl = `${this.apiUrl}/Reaction`;
  private postsSubject = new BehaviorSubject<Post[]>([]);
  posts$ = this.postsSubject.asObservable();

  // Subject for new posts
  private newPostSubject = new BehaviorSubject<Post | null>(null);
  newPost$ = this.newPostSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize posts from localStorage when service starts
    this.initializeFromLocalStorage();

    // Then fetch from API to get the latest data
    this.refreshPosts();
  }

  /**
   * Initialize posts from localStorage when the service starts
   */
  private initializeFromLocalStorage(): void {
    try {
      const storedPostsJson = localStorage.getItem('posts');
      if (storedPostsJson) {
        const storedPosts = JSON.parse(storedPostsJson);
        if (Array.isArray(storedPosts) && storedPosts.length > 0) {
          console.log('Initialized posts from localStorage:', storedPosts.length);
          this.postsSubject.next(storedPosts);
        }
      }
    } catch (error) {
      console.error('Error initializing posts from localStorage:', error);
    }
  }

  /**
   * Refresh posts from the API
   */
  refreshPosts(): void {
    this.getPosts().subscribe({
      next: (posts) => {
        console.log('Refreshed posts from API:', posts.length);
        this.postsSubject.next(posts);
      },
      error: (error) => {
        console.error('Error refreshing posts:', error);
      }
    });
  }

  /**
   * Generates a unique ID for a new post
   * @returns A unique ID string
   */
  private generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // Post related methods
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postApiUrl).pipe(
      map(posts => {
        const enhancedPosts = posts.map(post => this.ensurePostProperties(post));
        // Update localStorage with the latest posts from the server
        localStorage.setItem('posts', JSON.stringify(enhancedPosts));
        return enhancedPosts;
      }),
      catchError(error => {
        console.error('Error loading posts:', error);
        // Load posts from localStorage when API fails
        try {
          const storedPostsJson = localStorage.getItem('posts');
          if (storedPostsJson) {
            const storedPosts = JSON.parse(storedPostsJson);
            console.log('Loaded posts from localStorage:', storedPosts.length);
            // Update the posts subject
            this.postsSubject.next(storedPosts);
            return of(storedPosts);
          }
        } catch (e) {
          console.error('Error loading posts from localStorage:', e);
        }
        // Return empty array if no posts in localStorage
        return of([]);
      })
    );
  }

  /**
   * Creates a new post
   * @param post The post to create
   * @returns Observable of the created post
   */
  createPost(post: Post): Observable<Post> {
    // Ensure post has a valid ID
    if (!post.id) {
      post.id = this.generateUniqueId();
    }

    // Set timestamp if not provided
    if (!post.timestamp) {
      post.timestamp = new Date();
    }

    // Initialize empty arrays/objects if not provided
    if (!post.comments) post.comments = [];
    if (!post.reactions) post.reactions = {};
    if (!post.topReactions) post.topReactions = [];

    // Save post to localStorage for persistence
    this.savePostToLocalStorage(post);

    // Make API call to create post
    return this.http.post<Post>(`${this.postApiUrl}`, post).pipe(
      map(createdPost => {
        const enhancedPost = this.ensurePostProperties(createdPost);
        // Update localStorage with the server response
        this.savePostToLocalStorage(enhancedPost);
        return enhancedPost;
      }),
      catchError(error => {
        console.error('Error creating post:', error);

        // Local fallback: Add post to local state
        const posts = this.postsSubject.getValue();
        const newPosts = [post, ...posts];
        this.postsSubject.next(newPosts);

        // Notify subscribers about the new post
        this.newPostSubject.next(post);

        // Return the post as if it was created successfully
        return of(post);
      })
    );
  }

  /**
   * Saves a post to localStorage for persistence
   * @param post The post to save
   */
  private savePostToLocalStorage(post: Post): void {
    try {
      // Get existing posts from localStorage
      const storedPostsJson = localStorage.getItem('posts');
      let storedPosts: Post[] = [];

      if (storedPostsJson) {
        storedPosts = JSON.parse(storedPostsJson);
      }

      // Check if post already exists
      const existingPostIndex = storedPosts.findIndex(p => p.id === post.id);

      if (existingPostIndex >= 0) {
        // Update existing post
        storedPosts[existingPostIndex] = post;
      } else {
        // Add new post
        storedPosts.unshift(post);
      }

      // Save back to localStorage
      localStorage.setItem('posts', JSON.stringify(storedPosts));
    } catch (error) {
      console.error('Error saving post to localStorage:', error);
    }
  }

  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.postApiUrl}/${id}`).pipe(
      map(post => this.ensurePostProperties(post))
    );
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.postApiUrl}/${id}`).pipe(
      map(post => this.ensurePostProperties(post))
    );
  }

  updatePost(id: string, post: Partial<Post>): Observable<Post> {
    return this.http.put<Post>(`${this.postApiUrl}/${id}`, post).pipe(
      map(updatedPost => this.ensurePostProperties(updatedPost))
    );
  }

  deletePost(id: string): Observable<any> {
    return this.http.delete(`${this.postApiUrl}/${id}`);
  }

  /**
   * Likes or unlikes a post
   * @param id The ID of the post to like/unlike
   * @returns The updated post
   */
  likePost(id: string): Observable<Post | null> {
    // First try to update via API
    return this.http.post<Post>(`${this.postApiUrl}/${id}/like`, {}).pipe(
      map(updatedPost => {
        // Update localStorage with the updated post
        this.updatePostInLocalStorage(updatedPost);
        return updatedPost;
      }),
      catchError(error => {
        console.error('Error liking post:', error);
        // Fallback to local update if API fails
        const posts = this.postsSubject.getValue();
        const post = posts.find(p => p.id === id);
        if (post) {
          post.liked = !post.liked;
          if (post.liked) {
            post.likes = (post.likes || 0) + 1;
          } else {
            post.likes = Math.max(0, (post.likes || 0) - 1);
          }
          this.postsSubject.next(posts);

          // Update localStorage with the modified post
          this.updatePostInLocalStorage(post);

          return of(post);
        }
        return of(null);
      })
    );
  }

  /**
   * Updates a post in localStorage
   * @param post The post to update
   */
  private updatePostInLocalStorage(post: Post): void {
    if (!post) return;

    try {
      const storedPostsJson = localStorage.getItem('posts');
      if (storedPostsJson) {
        const storedPosts = JSON.parse(storedPostsJson);
        const index = storedPosts.findIndex((p: Post) => p.id === post.id);

        if (index !== -1) {
          // Update existing post
          storedPosts[index] = post;
          localStorage.setItem('posts', JSON.stringify(storedPosts));
        } else {
          // Post doesn't exist in localStorage, add it
          this.savePostToLocalStorage(post);
        }
      } else {
        // No posts in localStorage yet, create new array
        this.savePostToLocalStorage(post);
      }
    } catch (error) {
      console.error('Error updating post in localStorage:', error);
    }
  }

  /**
   * Shares a post
   * @param id The ID of the post to share
   * @returns The updated post
   */
  sharePost(id: string): Observable<Post | null> {
    // First try to update via API
    return this.http.post<Post>(`${this.postApiUrl}/${id}/share`, {}).pipe(
      catchError(error => {
        console.error('Error sharing post:', error);

        // Fallback to local update if API fails
        const posts = this.postsSubject.getValue();
        const post = posts.find(p => p.id === id);

        if (post) {
          post.Shares = (post.Shares || 0) + 1;
          this.postsSubject.next(posts);
          return of(post);
        }

        return of(null);
      })
    );
  }

  // Comment related methods
  getComments(postId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.commentApiUrl}/post/${postId}`).pipe(
      catchError(error => {
        console.error('Error fetching comments:', error);
        return of([]);
      })
    );
  }

  /**
   * Adds a comment to a post with fallback for when the API is unavailable
   * @param postId The ID of the post to comment on
   * @param comment The comment text
   * @returns Observable of the created comment
   */
  addComment(postId: string, comment: string): Observable<Comment> {
    return this.http.post<Comment>(this.commentApiUrl, {
      postId,
      content: comment
    }).pipe(
      catchError(error => {
        console.error('Error adding comment:', error);

        // Create a local comment as fallback
        const newComment: Comment = {
          id: this.generateUniqueId(),
          postId: postId,
          username: 'Current User', // Placeholder username
          profileImageUrl: 'https://randomuser.me/api/portraits/men/11.jpg', // Placeholder image
          content: comment,
          timestamp: new Date(),
          likes: 0,
          replies: [],
          isEditing: false,
          showReplyInput: false,
          editHistory: [],
          editText: ''
        };

        // Update the post in the local state to include this comment
        const posts = this.postsSubject.getValue();
        const postIndex = posts.findIndex(p => p.id === postId);

        if (postIndex !== -1) {
          // Create a copy of the post to modify
          const updatedPost = { ...posts[postIndex] };

          // Add the comment to the post
          if (!updatedPost.comments) {
            updatedPost.comments = [];
          }
          updatedPost.comments = [newComment, ...updatedPost.comments];

          // Update the posts array
          const newPosts = [...posts];
          newPosts[postIndex] = updatedPost;
          this.postsSubject.next(newPosts);
        }

        return of(newComment);
      })
    );
  }

  /**
   * Likes a comment
   * @param id The ID of the comment to like
   * @returns Observable of the updated comment
   */
  likeComment(id: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.commentApiUrl}/${id}/like`, {}).pipe(
      catchError(error => {
        console.error('Error liking comment:', error);

        // Fallback: Update the comment locally
        const posts = this.postsSubject.getValue();
        let updatedComment: Comment | null = null;

        // Find the comment in all posts
        const updatedPosts = posts.map(post => {
          if (!post.comments) return post;

          const comments = post.comments.map(c => {
            if (c.id === id) {
              updatedComment = {
                ...c,
                likes: (c.likes || 0) + 1,
                isLikedByCurrentUser: true
              };
              return updatedComment;
            }
            return c;
          });

          return { ...post, comments };
        });

        this.postsSubject.next(updatedPosts);

        // Create a placeholder comment if none was found
        const commentToReturn: Comment = updatedComment || {
          id,
          username: 'User',
          content: '',
          profileImageUrl: 'https://randomuser.me/api/portraits/men/11.jpg',
          timestamp: new Date(),
          likes: 1,
          replies: []
        };

        // Always return a non-null Comment object
        return of(commentToReturn);
      })
    );
  }

  // Reaction related methods
  getReactions(postId: string): Observable<Reaction[]> {
    // Validate the post ID before making the API call
    if (!postId) {
      console.error('Invalid post ID for getting reactions:', postId);
      return new Observable<Reaction[]>(observer => {
        observer.error(new Error('Invalid post ID'));
      });
    }

    return this.http.get<Reaction[]>(`${this.reactionApiUrl}/post/${postId}`).pipe(
      catchError(error => {
        console.error('Error fetching reactions:', error);
        // Return empty array as fallback
        return of<Reaction[]>([]);
      })
    );
  }

  addReaction(postId: string, reactionType: string): Observable<any> {
    // Validate the post ID and reaction type before making the API call
    if (!postId) {
      console.error('Invalid post ID for adding reaction:', postId);
      return new Observable(observer => {
        observer.error(new Error('Invalid post ID'));
      });
    }

    if (!reactionType || typeof reactionType !== 'string') {
      console.error('Invalid reaction type:', reactionType);
      return new Observable(observer => {
        observer.error(new Error('Invalid reaction type'));
      });
    }

    return this.http.post(this.reactionApiUrl, {
      postId,
      reactionType
    }).pipe(
      catchError(error => {
        console.error('Error adding reaction:', error);

        // Return a successful response to prevent UI disruption
        // The component will handle the local state update
        return of({ success: true, message: 'Reaction added locally' });
      })
    );
  }

  removeReaction(id: string): Observable<any> {
    // Validate the reaction ID before making the API call
    if (!id) {
      console.error('Invalid reaction ID for removal:', id);
      return new Observable(observer => {
        observer.error(new Error('Invalid reaction ID'));
      });
    }

    return this.http.delete(`${this.reactionApiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error removing reaction:', error);

        // Return a successful response to prevent UI disruption
        // The component will handle the local state update
        return of({ success: true, message: 'Reaction removed locally' });
      })
    );
  }

  // Helper methods
  getPostsByCategory(category: string): Post[] {
    const posts = this.postsSubject.getValue();
    return posts.filter(post => post.category === category);
  }

  getPostsBySubCategory(category: string, subCategory: string): Post[] {
    const posts = this.postsSubject.getValue();
    return posts
      .filter(post => post.category === category && post.subCategory === subCategory);
  }

  filterBySubCategory(category: string, subCategory: string): Post[] {
    const posts = this.postsSubject.value;
    return posts
      .filter(post => post.category === category && post.subCategory === subCategory);
  }

  /**
   * Updates the posts in the BehaviorSubject
   * @param posts The new posts to set
   */
  updatePosts(posts: Post[]): void {
    this.postsSubject.next(posts.map(post => this.ensurePostProperties(post)));
  }

  /**
   * Adds a new post to the posts collection and emits it through the newPostSubject
   * @param post The post to add
   */
  addPost(post: Post): void {
    // Ensure the post has all required properties
    const completePost = this.ensurePostProperties(post);

    // Add the post to the current posts collection
    const currentPosts = this.postsSubject.getValue();
    this.postsSubject.next([completePost, ...currentPosts]);

    // Emit the new post through the newPostSubject
    this.newPostSubject.next(completePost);
  }

  /**
   * Gets an observable that emits when a new post is added
   * @returns Observable of the new post
   */
  getNewPostObservable(): Observable<Post | null> {
    return this.newPostSubject.asObservable();
  }

  /**
   * Ensures all required properties exist on a post object
   * @param post Partial post object that may be missing properties
   * @returns Complete post object with all required properties
   */
  private ensurePostProperties(post: Partial<Post>): Post {
    return {
      id: post.id || this.generateUniqueId(),
      content: post.content || '',
      username: post.username || '',
      profileImageUrl: post.profileImageUrl || '',
      timestamp: post.timestamp || new Date(),
      category: post.category || '',
      subCategory: post.subCategory || '',
      images: post.images || [],
      media: post.media || [],
      currentImageIndex: post.currentImageIndex || 0,
      likes: post.likes || 0,
      Shares: post.Shares || 0,
      Saves: post.Saves || 0,
      showComments: post.showComments || false,
      isEditing: post.isEditing || false,
      liked: post.liked || false,
      saved: post.saved || false,
      isFollowing: post.isFollowing || false,
      comments: post.comments || [],
      topReactions: post.topReactions || []
    };
  }

  // Method to add a comment to the backend
  addCommentToBackend(commentData: any): Observable<any> {
    // TODO: Implement the actual HTTP POST request to your backend's add comment endpoint
    // Example: return this.http.post<any>(`${this.baseUrl}/comments`, commentData);

    // Placeholder for now (replace with actual backend call)
    console.log('Calling backend to add comment:', commentData);
    // Simulate a backend response with a temporary ID and timestamp
    const tempComment = {
      ...commentData,
      id: Date.now(), // Replace with backend generated ID
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      replies: []
     };

    // You will get the actual saved comment object from your backend here
    return new Observable(observer => {
      // Simulate network delay
      setTimeout(() => {
        observer.next(tempComment);
        observer.complete();
      }, 500);
    });
  }

  // Method to add a reply to the backend
  addReplyToBackend(replyData: any): Observable<any> {
    // TODO: Implement the actual HTTP POST request to your backend's add reply endpoint
    // Example: return this.http.post<any>(`${this.baseUrl}/replies`, replyData);

    // Placeholder for now (replace with actual backend call)
    console.log('Calling backend to add reply:', replyData);
    // Simulate a backend response with a temporary ID and timestamp
    const tempReply = {
      ...replyData,
      id: Date.now(), // Replace with backend generated ID
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [],
     };

    // You will get the actual saved reply object from your backend here
    return new Observable(observer => {
      // Simulate network delay
      setTimeout(() => {
        observer.next(tempReply);
        observer.complete();
      }, 500);
    });
  }
}
