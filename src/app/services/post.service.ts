import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../interfaces/post';
import { Firestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postsSubject = new BehaviorSubject<Post[]>([]);
  private savedPosts = new BehaviorSubject<Post[]>([]);
  posts$ = this.postsSubject.asObservable();

  constructor(private firestore: Firestore) {
    // Load saved posts from localStorage on service initialization
    const savedPosts = localStorage.getItem('savedPosts');
    if (savedPosts) {
      this.savedPosts.next(JSON.parse(savedPosts));
    }
  }

  getPost(id: string): Observable<Post> {
    return from(getDoc(doc(this.firestore, 'posts', id))).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          return this.ensurePostProperties({ id: docSnap.id, ...docSnap.data() });
        }
        throw new Error('Post not found');
      })
    );
  }

  getPosts(): Observable<Post[]> {
    return this.postsSubject.asObservable();
  }

  getSavedPosts(): Observable<Post[]> {
    return this.savedPosts.asObservable();
  }

  addPost(post: Post): Promise<void> {
    return addDoc(collection(this.firestore, 'posts'), post).then(docRef => {
      const currentPosts = this.postsSubject.value;
      this.postsSubject.next([this.ensurePostProperties({ ...post, id: docRef.id }), ...currentPosts]);
    });
  }

  filterBySubCategory(category: string, subCategory: string): Post[] {
    const posts = this.postsSubject.value;
    return posts
      .map(post => this.ensurePostProperties(post))
      .filter(post => post.category === category && post.subCategory === subCategory);
  }

  savePost(post: Post) {
    const currentSavedPosts = this.savedPosts.value;
    // Check if post is already saved
    if (!currentSavedPosts.find(p => p.id === post.id)) {
      const updatedSavedPosts = [post, ...currentSavedPosts];
      this.savedPosts.next(updatedSavedPosts);
      // Save to localStorage
      localStorage.setItem('savedPosts', JSON.stringify(updatedSavedPosts));
    }
  }

  removeSavedPost(postId: string) {
    const currentSavedPosts = this.savedPosts.value;
    const updatedSavedPosts = currentSavedPosts.filter(post => post.id !== postId);
    this.savedPosts.next(updatedSavedPosts);
    // Update localStorage
    localStorage.setItem('savedPosts', JSON.stringify(updatedSavedPosts));
  }

  updatePost(updatedPost: Post) {
    const currentPosts = this.postsSubject.value;
    const index = currentPosts.findIndex(post => post.id === updatedPost.id);
    if (index !== -1) {
      currentPosts[index] = updatedPost;
      this.postsSubject.next([...currentPosts]);
    }
  }

  deletePost(postId: string) {
    const currentPosts = this.postsSubject.value;
    const updatedPosts = currentPosts.filter(post => post.id !== postId);
    this.postsSubject.next(updatedPosts);
  }

  private ensurePostProperties(post: Partial<Post>): Post {
    return {
      id: post.id || '',
      content: post.content || '',
      username: post.username || '',
      profileImageUrl: post.profileImageUrl || '',
      timestamp: post.timestamp || new Date(),
      category: post.category || '',
      subCategory: post.subCategory || '',
      audience: post.audience || 'public',
      media: post.media || [],
      currentImageIndex: post.currentImageIndex || 0,
      likes: post.likes || 0,
      Shares: post.Shares || 0,
      Saves: post.Saves || 0,
      showComments: post.showComments || false,
      isEditing: post.isEditing || false,
      liked: post.liked || false,
      saved: post.saved || false,
      comments: post.comments || [],
      isFollowing: post.isFollowing || false
    };
  }
}
