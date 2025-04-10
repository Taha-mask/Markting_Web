import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../../services/firebase.service';
import { Post } from '../../interfaces/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private firebaseService: FirebaseService) {}

  getPosts(): Observable<Post[]> {
    return this.firebaseService.getPosts();
  }

  getTrendingPosts(): Observable<Post[]> {
    return this.firebaseService.getTrendingPosts();
  }

  getPostsByCategory(category: string): Observable<Post[]> {
    return this.firebaseService.getPostsByCategory(category);
  }

  async createPost(post: Post): Promise<string> {
    return await this.firebaseService.addPost(post);
  }

  async updatePost(postId: string, data: Partial<Post>): Promise<void> {
    await this.firebaseService.updatePost(postId, data);
  }

  async deletePost(postId: string): Promise<void> {
    await this.firebaseService.deletePost(postId);
  }

  async uploadImage(file: File): Promise<string> {
    return await this.firebaseService.uploadImage(file);
  }

  async addComment(postId: string, comment: any): Promise<string> {
    return await this.firebaseService.addComment(postId, comment);
  }

  getComments(postId: string): Observable<any[]> {
    return this.firebaseService.getComments(postId);
  }

  async addReaction(postId: string, userId: string, reactionType: string): Promise<void> {
    await this.firebaseService.addReaction(postId, userId, reactionType);
  }

  getReactions(postId: string): Observable<any[]> {
    return this.firebaseService.getReactions(postId);
  }
}
