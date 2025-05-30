import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase!: SupabaseClient;
  private readonly SUPABASE_URL = 'https://kepydzjtwaelfahuxfpu.supabase.co';
  private readonly SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlcHlkemp0d2FlbGZhaHV4ZnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NzI4MDYsImV4cCI6MjA2NDE0ODgwNn0.JPbnkp1OlGivY5w0pBlytKTeETc0ztSkB3aro-Bq-YE';

  constructor(private firebaseService: FirebaseService) {
    this.initializeSupabase();
  }

  private async initializeSupabase() {
    this.supabase = createClient(this.SUPABASE_URL, this.SUPABASE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    });

    // Listen for auth state changes
    this.firebaseService.getAuth().onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        this.supabase.auth.setSession({
          access_token: token,
          refresh_token: ''
        });
      } else {
        this.supabase.auth.setSession({
          access_token: '',
          refresh_token: ''
        });
      }
    });
  }

  // Upload user avatar
  async uploadUserAvatar(file: File): Promise<string> {
    try {
      const user = this.firebaseService.getCurrentUser();
      if (!user) {
        throw new Error('User must be authenticated to upload avatar');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.uid}/${Date.now()}.${fileExt}`;

      const { data, error } = await this.supabase.storage
        .from('user-avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });

      if (error) {
        console.error('Error uploading image:', error);
        throw error;
      }

      const { data: { publicUrl } } = this.supabase.storage
        .from('user-avatars')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadUserAvatar:', error);
      throw error;
    }
  }

  // Upload marketer avatar
  async uploadMarketerAvatar(file: File): Promise<string> {
    try {
      const user = this.firebaseService.getCurrentUser();
      if (!user) {
        throw new Error('User must be authenticated to upload avatar');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.uid}/${Date.now()}.${fileExt}`;

      const { data, error } = await this.supabase.storage
        .from('marketers-avatar')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });

      if (error) {
        console.error('Error uploading image:', error);
        throw error;
      }

      const { data: { publicUrl } } = this.supabase.storage
        .from('marketers-avatar')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadMarketerAvatar:', error);
      throw error;
    }
  }

  // Upload marketer ID document
  async uploadMarketerId(file: File): Promise<string> {
    try {
      const user = this.firebaseService.getCurrentUser();
      if (!user) {
        throw new Error('User must be authenticated to upload ID document');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.uid}/${Date.now()}.${fileExt}`;

      const { data, error } = await this.supabase.storage
        .from('marketers-id')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });

      if (error) {
        console.error('Error uploading ID document:', error);
        throw error;
      }

      const { data: { publicUrl } } = this.supabase.storage
        .from('marketers-id')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadMarketerId:', error);
      throw error;
    }
  }

  // Upload post image
  async uploadPostImage(file: File): Promise<string> {
    try {
      const user = this.firebaseService.getCurrentUser();
      if (!user) {
        throw new Error('User must be authenticated to upload post image');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.uid}/${Date.now()}.${fileExt}`;

      const { data, error } = await this.supabase.storage
        .from('post-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });

      if (error) {
        console.error('Error uploading post image:', error);
        throw error;
      }

      const { data: { publicUrl } } = this.supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadPostImage:', error);
      throw error;
    }
  }

  // Upload marketing material
  async uploadMarketingMaterial(file: File): Promise<string> {
    try {
      const user = this.firebaseService.getCurrentUser();
      if (!user) {
        throw new Error('User must be authenticated to upload marketing material');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.uid}/${Date.now()}.${fileExt}`;

      const { data, error } = await this.supabase.storage
        .from('marketing-materials')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });

      if (error) {
        console.error('Error uploading marketing material:', error);
        throw error;
      }

      const { data: { publicUrl } } = this.supabase.storage
        .from('marketing-materials')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadMarketingMaterial:', error);
      throw error;
    }
  }

  // Upload temporary file
  async uploadTemporaryFile(file: File): Promise<string> {
    try {
      const user = this.firebaseService.getCurrentUser();
      if (!user) {
        throw new Error('User must be authenticated to upload file');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.uid}/${Date.now()}.${fileExt}`;

      const { data, error } = await this.supabase.storage
        .from('temporary-uploads')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });

      if (error) {
        console.error('Error uploading temporary file:', error);
        throw error;
      }

      const { data: { publicUrl } } = this.supabase.storage
        .from('temporary-uploads')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadTemporaryFile:', error);
      throw error;
    }
  }

  // Video upload method
  async uploadVideo(file: File, bucket: string = 'temporary-uploads'): Promise<string> {
    try {
      const user = this.firebaseService.getCurrentUser();
      if (!user) {
        throw new Error('User must be authenticated to upload video');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.uid}/${Date.now()}.${fileExt}`;

      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });

      if (error) {
        console.error('Error uploading video:', error);
        throw error;
      }

      const { data: { publicUrl } } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadVideo:', error);
      throw error;
    }
  }

  // Generic image upload method
  async uploadImage(file: File, bucket: string = 'user-avatars'): Promise<string> {
    try {
      const user = this.firebaseService.getCurrentUser();
      if (!user) {
        throw new Error('User must be authenticated to upload image');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.uid}/${Date.now()}.${fileExt}`;

      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });

      if (error) {
        console.error('Error uploading image:', error);
        throw error;
      }

      const { data: { publicUrl } } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
    }
  }
}
