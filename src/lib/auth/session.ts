import { supabase } from '../supabase';

export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
}

export async function refreshSession() {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Failed to refresh session:', error);
    return null;
  }
}

export async function initializeAuth() {
  try {
    const session = await getSession();
    if (!session) {
      return null;
    }
    return session.user;
  } catch (error) {
    console.error('Session initialization error:', error);
    return null;
  }
}