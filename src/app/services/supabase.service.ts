import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.key
    );
  }

  // Marketers Collection
  async addMarketer(marketerData: any) {
    try {
      const { data, error } = await this.supabase
        .from('marketers')
        .insert([marketerData])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error adding marketer: ', error);
      throw error;
    }
  }

  async getMarketers() {
    try {
      const { data, error } = await this.supabase
        .from('marketers')
        .select('*');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting marketers: ', error);
      throw error;
    }
  }

  // Users Collection
  async addUser(userData: any) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .insert([userData])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error adding user: ', error);
      throw error;
    }
  }

  async getUsers() {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting users: ', error);
      throw error;
    }
  }

  // Common methods for both collections
  async getDocument(tableName: string, id: string) {
    try {
      const { data, error } = await this.supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error getting document from ${tableName}: `, error);
      throw error;
    }
  }

  async updateDocument(tableName: string, id: string, data: any) {
    try {
      const { error } = await this.supabase
        .from(tableName)
        .update(data)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error(`Error updating document in ${tableName}: `, error);
      throw error;
    }
  }

  async deleteDocument(tableName: string, id: string) {
    try {
      const { error } = await this.supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting document from ${tableName}: `, error);
      throw error;
    }
  }
}
