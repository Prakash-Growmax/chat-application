import { supabase } from '../supabase';
import { buildUserProfile } from './subscription-service';
import { getCurrentSession, getCurrentUser } from './auth-utils';
import { toast } from 'sonner';

export async function signInWithOTP(email: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function verifyOTP(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (error) throw error;
  return data;
}

export async function initializeUserProfile() {
  try {
    const session = await getCurrentSession();
    if (!session) return null;

    const user = await getCurrentUser();
    if (!user) return null;

    return await buildUserProfile(user);
  } catch (error) {
    console.error('Error initializing user profile:', error);
    toast.error('Failed to initialize user profile');
    return null;
  }
}