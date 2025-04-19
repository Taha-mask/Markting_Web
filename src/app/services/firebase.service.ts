import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  collectionData, 
  query, 
  where,
  orderBy,
  limit 
} from '@angular/fire/firestore';
import { 
  Storage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Post } from '../interfaces/post';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) {}

  // Posts Methods
  getPosts(): Observable<Post[]> {
    const postsRef = collection(this.firestore, 'posts');
    return collectionData(postsRef, { idField: 'id' }) as Observable<Post[]>;
  }

  getTrendingPosts(): Observable<Post[]> {
    const postsRef = collection(this.firestore, 'posts');
    const q = query(postsRef, 
      orderBy('likes', 'desc'),
      limit(10)
    );
    return collectionData(q, { idField: 'id' }) as Observable<Post[]>;
  }

  getPostsByCategory(category: string): Observable<Post[]> {
    const postsRef = collection(this.firestore, 'posts');
    const q = query(postsRef, where('category', '==', category));
    return collectionData(q, { idField: 'id' }) as Observable<Post[]>;
  }

  async addPost(post: Post): Promise<string> {
    const postsRef = collection(this.firestore, 'posts');
    const docRef = await addDoc(postsRef, post);
    return docRef.id;
  }

  async updatePost(postId: string, data: Partial<Post>): Promise<void> {
    const postRef = doc(this.firestore, `posts/${postId}`);
    await updateDoc(postRef, data);
  }

  async deletePost(postId: string): Promise<void> {
    const postRef = doc(this.firestore, `posts/${postId}`);
    await deleteDoc(postRef);
  }

  // File Upload Methods
  async uploadImage(file: File): Promise<string> {
    const path = `images/${new Date().getTime()}_${file.name}`;
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  // Comments Methods
  async addComment(postId: string, comment: any): Promise<string> {
    const commentsRef = collection(this.firestore, `posts/${postId}/comments`);
    const docRef = await addDoc(commentsRef, {
      ...comment,
      timestamp: new Date()
    });
    return docRef.id;
  }

  getComments(postId: string): Observable<any[]> {
    const commentsRef = collection(this.firestore, `posts/${postId}/comments`);
    const q = query(commentsRef, orderBy('timestamp', 'desc'));
    return collectionData(q, { idField: 'id' });
  }

  // Reactions Methods
  async addReaction(postId: string, userId: string, reactionType: string): Promise<void> {
    const reactionRef = doc(this.firestore, `posts/${postId}/reactions/${userId}`);
    await updateDoc(reactionRef, {
      type: reactionType,
      timestamp: new Date()
    });
  }

  getReactions(postId: string): Observable<any[]> {
    const reactionsRef = collection(this.firestore, `posts/${postId}/reactions`);
    return collectionData(reactionsRef, { idField: 'userId' });
  }
}
