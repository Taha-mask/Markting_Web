import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError, from, BehaviorSubject } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  UserCredential,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where
} from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Router } from '@angular/router';

interface OAuthResponse {
  token: string;
  userId: string;
}

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  role: string;
  token?: string;
  profileImage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userType: string = '';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router = inject(Router);

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();

    // Listen for auth state changes
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const userData = await this.getUserDataFromFirestore(user.uid);

        if (userData) {
          const fullUser: User = {
            id: user.uid,
            firstName: userData['firstName'],
            lastName: userData['lastName'],
            email: userData['email'],
            phone: userData['phone'],
            role: userData['role'],
            token: token,
            profileImage: userData['profileImage']
          };
          this.currentUserSubject.next(fullUser);
          localStorage.setItem('currentUser', JSON.stringify(fullUser));
        }
      } else {
        this.currentUserSubject.next(null);
        localStorage.removeItem('currentUser');
      }
    });
  }

  // Get current user value
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Login user with Firebase
  async login(email: string, password: string): Promise<boolean> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      const userData = await this.getUserDataFromFirestore(userCredential.user.uid);

      if (userData) {
        const fullUser: User = {
          id: userCredential.user.uid,
          firstName: userData['firstName'],
          lastName: userData['lastName'],
          email: userData['email'],
          phone: userData['phone'],
          role: userData['role'],
          token: token,
          profileImage: userData['profileImage']
        };
        this.currentUserSubject.next(fullUser);
        localStorage.setItem('currentUser', JSON.stringify(fullUser));
        this.setUserType(userData['role']);
        return true;
      } else {
        console.error('No user data found in Firestore');
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  // Register user with Firebase
  async register(userData: Omit<User, 'id' | 'token'>): Promise<boolean> {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        userData.password || ''
      );

      // Save user data to Firestore
      const userDocRef = doc(this.firestore, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        role: userData.role || 'customer',
        createdAt: new Date().toISOString()
      });

      // Get token
      const token = await userCredential.user.getIdToken();

      // Create full user object
      const fullUser: User = {
        id: userCredential.user.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        role: userData.role || 'customer',
        token: token
      };

      // Update state
      this.currentUserSubject.next(fullUser);
      localStorage.setItem('currentUser', JSON.stringify(fullUser));
      this.setUserType(userData.role || 'customer');

      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.currentUserSubject.next(null);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  // Get user profile from Firestore
  async getUserProfile(userId: string): Promise<any> {
    try {
      const userData = await this.getUserDataFromFirestore(userId);
      return userData;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // Update user profile in Firestore
  async updateUserProfile(userId: string, profileData: Partial<User>): Promise<boolean> {
    try {
      const userDocRef = doc(this.firestore, 'users', userId);
      await updateDoc(userDocRef, {
        ...profileData,
        updatedAt: new Date().toISOString()
      });

      // Update local user if it's the current user
      if (this.currentUserValue?.id === userId) {
        const currentUser = this.currentUserValue;
        const updatedUser = { ...currentUser, ...profileData };
        this.currentUserSubject.next(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }

      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }

  // Get current user ID
  getCurrentUserId(): string {
    return this.currentUserValue?.id || '';
  }

  // Set user type
  setUserType(userType: string): void {
    this.userType = userType;
    localStorage.setItem('userType', userType);
  }

  // Get user type
  getUserType(): string {
    return this.userType || localStorage.getItem('userType') || '';
  }

  // Helper method to get user data from Firestore
  private async getUserDataFromFirestore(userId: string): Promise<any> {
    try {
      const userDocRef = doc(this.firestore, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error('Error getting user data from Firestore:', error);
      return null;
    }
  }

  // Google login
  async loginWithGoogle(): Promise<OAuthResponse> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const token = await result.user.getIdToken();
      return { token, userId: result.user.uid };
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  }

  // Facebook login
  async loginWithFacebook(): Promise<OAuthResponse> {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const token = await result.user.getIdToken();
      return { token, userId: result.user.uid };
    } catch (error) {
      console.error('Facebook login failed:', error);
      throw error;
    }
  }

  async registerMarketer(marketerData: any): Promise<any> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        marketerData.email,
        marketerData.password
      );

      const userDocRef = doc(this.firestore, 'marketers', userCredential.user.uid);
      await setDoc(userDocRef, {
        ...marketerData,
        userId: userCredential.user.uid,
        createdAt: new Date().toISOString()
      });

      return { success: true, message: 'Marketer registered successfully' };
    } catch (error) {
      console.error('Marketer registration failed:', error);
      throw error;
    }
  }
}
