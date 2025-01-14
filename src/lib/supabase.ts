import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseAnonKey?.slice(0, 10) + '...');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Profile management functions
export const profileAPI = {
  async createProfile(profile: Database['public']['Tables']['profiles']['Insert']) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getProfileById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProfile(id: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getProfilesByLocation(state: string, city: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('status', 'active')
      .eq('location', `${city}, ${state}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Post management functions
export const postAPI = {
  async createPost(post: Database['public']['Tables']['posts']['Insert']) {
    const { data, error } = await supabase
      .from('posts')
      .insert(post)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getPostsByLocation(state: string, city: string) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (*)
      `)
      .eq('status', 'active')
      .eq('location->state', state)
      .eq('location->city', city)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updatePost(id: string, updates: Partial<Database['public']['Tables']['posts']['Update']>) {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}; 