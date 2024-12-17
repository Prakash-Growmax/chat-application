import { supabase } from '../supabase';
import { loadingState } from '../loading-state';

export async function createSubscription(planName: string): Promise<{ url: string }> {
  try {
    loadingState.startLoading('Updating subscription...');
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { error } = await supabase
      .from('subscriptions')
      .update({
        plan: planName,
        token_usage: 0,
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    return { url: '/dashboard' };
  } catch (error) {
    console.error('Failed to create subscription:', error);
    throw new Error('Failed to update subscription');
  } finally {
    loadingState.stopLoading();
  }
}

export async function updateSubscription(userId: string, plan: string): Promise<void> {
  try {
    loadingState.startLoading('Updating subscription...');
    
    const { error } = await supabase
      .from('subscriptions')
      .update({
        plan,
        token_usage: 0,
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      throw new Error('Failed to update subscription');
    }
  } finally {
    loadingState.stopLoading();
  }
}

export async function getSubscriptionDetails(userId: string) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new Error('Failed to fetch subscription details');
    }

    return data;
  } catch (error) {
    console.error('Failed to get subscription details:', error);
    throw error;
  }
}

export async function cancelSubscription(userId: string): Promise<void> {
  try {
    loadingState.startLoading('Cancelling subscription...');
    
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      throw new Error('Failed to cancel subscription');
    }
  } finally {
    loadingState.stopLoading();
  }
}

export async function updateTokenUsage(userId: string, tokens: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({ token_usage: tokens })
      .eq('user_id', userId);

    if (error) {
      throw new Error('Failed to update token usage');
    }
  } catch (error) {
    console.error('Error updating token usage:', error);
    throw error;
  }
}