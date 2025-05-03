import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { Post } from '../interfaces/post';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/posts`;
  private postsSubject = new BehaviorSubject<Post[]>([]);
  posts$ = this.postsSubject.asObservable();

  constructor(private http: HttpClient) { }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`).pipe(
      map(post => this.ensurePostProperties(post))
    );
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      map(posts => posts.map(post => this.ensurePostProperties(post)))
    );
  }

  addPost(post: Post): void {
    const currentPosts = this.postsSubject.value;
    this.postsSubject.next([this.ensurePostProperties(post), ...currentPosts]);
  }

  filterBySubCategory(category: string, subCategory: string): Post[] {
    const posts = this.postsSubject.value;
    return posts
      .map(post => this.ensurePostProperties(post))
      .filter(post => post.category === category && post.subCategory === subCategory);
  }

  private ensurePostProperties(post: Partial<Post>): Post {
    return {
      id: post.id || '',
      title: post.title || '',
      content: post.content || '',
      imageUrl: post.imageUrl || '',
      author: post.author || '',
      date: post.date || new Date(),
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