import { supabase } from '../supabase';
import { User } from '@/types';

export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function refreshSession() {
  const { data: { session }, error } = await supabase.auth.refreshSession();
  if (error) throw error;
  return session;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}