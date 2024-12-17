import { supabase } from './supabase';
import { User } from '@/types';

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !supabaseUser) {
      return null;
    }

    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('plan, token_usage, status')
      .eq('user_id', supabaseUser.id)
      .single();

    if (subscriptionError) {
      console.error('Failed to fetch subscription:', subscriptionError);
      return null;
    }

    if (!subscription) {
      const { error: createError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: supabaseUser.id,
          plan: 'single',
          token_usage: 0,
          status: 'active',
        });

      if (createError) {
        console.error('Failed to create subscription:', createError);
        return null;
      }

      return {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata.full_name || 'User',
        plan: 'single',
        tokenUsage: 0,
      };
    }

    return {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      name: supabaseUser.user_metadata.full_name || 'User',
      plan: subscription.plan,
      tokenUsage: subscription.token_usage,
    };
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}