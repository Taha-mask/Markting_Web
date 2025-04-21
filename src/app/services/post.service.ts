import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../interfaces/post';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts = new BehaviorSubject<Post[]>([]);
  posts$ = this.posts.asObservable();

  constructor(private apiService: ApiService) {
    this.loadPosts();
  }

  private loadPosts() {
    this.apiService.get<Post[]>('posts').subscribe(
      posts => this.posts.next(posts),
      error => console.error('Error loading posts:', error)
    );
  }

  getPosts(): Observable<Post[]> {
    return this.posts$;
  }

  addPost(post: Post): Observable<Post> {
    return this.apiService.post<Post>('posts', post).pipe(
      map(newPost => {
        const currentPosts = this.posts.value;
        this.posts.next([newPost, ...currentPosts]);
        return newPost;
      })
    );
  }

  updatePost(id: string, post: Post): Observable<Post> {
    return this.apiService.put<Post>(`posts/${id}`, post).pipe(
      map(updatedPost => {
        const currentPosts = this.posts.value;
        const index = currentPosts.findIndex(p => p.id === id);
        if (index !== -1) {
          currentPosts[index] = updatedPost;
          this.posts.next([...currentPosts]);
        }
        return updatedPost;
      })
    );
  }

  deletePost(id: string): Observable<void> {
    return this.apiService.delete<void>(`posts/${id}`).pipe(
      map(() => {
        const currentPosts = this.posts.value;
        this.posts.next(currentPosts.filter(post => post.id !== id));
      })
    );
  }

  filterByCategory(category: string): Post[] {
    if (category === 'All') {
      return this.posts.value;
    }
    return this.posts.value.filter(post => 
      post.category.toLowerCase() === category.toLowerCase()
    );
  }

  filterBySubCategory(category: string, subCategory: string): Post[] {
    if (subCategory === 'All') {
      return this.filterByCategory(category);
    }
    return this.posts.value.filter(post => 
      post.category.toLowerCase() === category.toLowerCase() &&
      post.subCategory?.toLowerCase() === subCategory.toLowerCase()
    );
  }
} 