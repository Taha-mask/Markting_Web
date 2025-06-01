import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';
import { Firestore, collection, addDoc, doc, getDoc } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from '@angular/fire/auth';

// Supabase configuration
const supabaseUrl = 'https://kepydzjtwaelfahuxfpu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlcHlkemp0d2FlbGZhaHV4ZnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NzI4MDYsImV4cCI6MjA2NDE0ODgwNn0.JPbnkp1OlGivY5w0pBlytKTeETc0ztSkB3aro-Bq-YE';

@Injectable({
  providedIn: 'root'
})
export class FirebaseSupabaseService {
  private supabase: SupabaseClient;

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {
    // Initialize Supabase
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Firebase Authentication
  async createUser(email: string, password: string): Promise<string> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return userCredential.user.uid;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Firebase Operations
  async addDocument(collectionName: string, data: any): Promise<string> {
    try {
      const docRef = await addDoc(collection(this.firestore, collectionName), data);
      return docRef.id;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  // Supabase Storage Operations
  async uploadAvatar(file: File): Promise<string> {
    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload file to Supabase storage
      const { data, error } = await this.supabase.storage
        .from('marketers-avatar')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = this.supabase.storage
        .from('marketers-avatar')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  }

  async uploadIdDocument(file: File): Promise<string> {
    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `id_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload file to Supabase storage
      const { data, error } = await this.supabase.storage
        .from('marketers-id')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = this.supabase.storage
        .from('marketers-id')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading ID document:', error);
      throw error;
    }
  }

  // Observable wrappers
  uploadAvatar$(file: File): Observable<string> {
    return from(this.uploadAvatar(file));
  }

  uploadIdDocument$(file: File): Observable<string> {
    return from(this.uploadIdDocument(file));
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  // Get document from Firestore
  async getDocument(collection: string, docId: string) {
    try {
      const docRef = doc(this.firestore, collection, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }
} 