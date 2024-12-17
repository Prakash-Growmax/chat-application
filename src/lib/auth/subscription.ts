import { supabase } from '../supabase';
import { User } from '@/types';
import { toast } from 'sonner';

export async function getUserSubscription(userId: string) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle instead of single to handle no results gracefully

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

export async function createInitialSubscription(userId: string) {
  try {
    // First check if subscription already exists
    const existingSubscription = await getUserSubscription(userId);
    if (existingSubscription) {
      return existingSubscription;
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan: 'single',
        token_usage: 0,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    // Return a default subscription object if creation fails
    return {
      plan: 'single',
      token_usage: 0,
      status: 'active'
    };
  }
}

export async function buildUserProfile(supabaseUser: any): Promise<User> {
  try {
    let subscription = await getUserSubscription(supabaseUser.id);
    
    if (!subscription) {
      subscription = await createInitialSubscription(supabaseUser.id);
    }

    // Ensure we have valid subscription data
    const plan = subscription?.plan || 'single';
    const tokenUsage = subscription?.token_usage || 0;

    return {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      name: supabaseUser.user_metadata?.full_name || 
            supabaseUser.email?.split('@')[0] || 
            'User',
      plan,
      tokenUsage,
    };
  } catch (error) {
    console.error('Error building user profile:', error);
    toast.error('Error loading user profile');
    
    // Return a default user profile if there's an error
    return {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      name: supabaseUser.email?.split('@')[0] || 'User',
      plan: 'single',
      tokenUsage: 0,
    };
  }
}

export async function updateSubscription(userId: string, plan: string) {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({ plan })
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

export async function getSubscriptionStatus(userId: string) {
  try {
    const subscription = await getUserSubscription(userId);
    return {
      isActive: subscription?.status === 'active',
      plan: subscription?.plan || 'single',
      tokenUsage: subscription?.token_usage || 0
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return {
      isActive: true,
      plan: 'single',
      tokenUsage: 0
    };
  }
}