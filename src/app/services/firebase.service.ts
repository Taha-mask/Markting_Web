import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  role: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private auth;
  private db;
  private currentUser: FirebaseUser | null = null;

  constructor(private router: Router) {
    const app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(app);
    this.db = getFirestore(app);

    // Listen for auth state changes
    this.auth.onAuthStateChanged((user) => {
      this.currentUser = user;
    });
  }

  // Authentication Methods
  async register(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return userCredential;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  getCurrentUser(): FirebaseUser | null {
    return this.currentUser;
  }

  getAuth() {
    return this.auth;
  }

  // Marketers Collection
  async addMarketer(marketerData: any): Promise<string> {
    try {
      if (!this.currentUser?.uid) {
        throw new Error('No authenticated user found');
      }

      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'companyName'];
      const missingFields = requiredFields.filter(field => !marketerData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Create marketer document with timestamp and user ID
      const marketerDoc = {
        ...marketerData,
        userId: this.currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
      };

      // Add document to marketers collection
      const docRef = await addDoc(collection(this.db, 'marketers'), marketerDoc);

      console.log('Marketer added successfully with ID:', docRef.id);
      return docRef.id;

    } catch (error: any) {
      console.error('Error adding marketer:', error);
      throw new Error(`Failed to add marketer: ${error.message}`);
    }
  }

  async getMarketers() {
    try {
      const querySnapshot = await getDocs(collection(this.db, 'marketers'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting marketers:', error);
      throw error;
    }
  }

  async getMarketerByUserId(userId: string) {
    try {
      const q = query(collection(this.db, 'marketers'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting marketer:', error);
      throw error;
    }
  }

  // Users Collection
  async addUser(userData: any) {
    try {
      const docRef = await addDoc(collection(this.db, 'users'), {
        ...userData,
        userId: this.currentUser?.uid,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  async getUsers() {
    try {
      const querySnapshot = await getDocs(collection(this.db, 'users'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  async getUserByUserId(userId: string) {
    try {
      const q = query(collection(this.db, 'users'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  // Common methods for both collections
  async updateDocument(collectionName: string, docId: string, data: any) {
    try {
      const docRef = doc(this.db, collectionName, docId);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      throw error;
    }
  }

  async deleteDocument(collectionName: string, docId: string) {
    try {
      const docRef = doc(this.db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  }
}
