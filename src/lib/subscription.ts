import { supabase } from './supabase';
import { User, SubscriptionPlan } from '@/types';
import { toast } from 'sonner';

export async function updateSubscription(
  userId: string,
  plan: SubscriptionPlan
): Promise<void> {
  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      plan,
      token_usage: 0,
      status: 'active',
      updated_at: new Date().toISOString(),
    });

  if (error) {
    throw new Error('Failed to update subscription');
  }
}

export async function getSubscriptionDetails(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw new Error('Failed to fetch subscription details');
  }

  return data;
}

export async function resetTokenUsage(userId: string): Promise<void> {
  const { error } = await supabase
    .from('subscriptions')
    .update({ token_usage: 0 })
    .eq('user_id', userId);

  if (error) {
    throw new Error('Failed to reset token usage');
  }
}

export async function checkTokenAvailability(
  user: User,
  requiredTokens: number
): Promise<boolean> {
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('token_usage, plan')
    .eq('user_id', user.id)
    .single();

  if (!subscription) return false;

  const planLimits = {
    single: 1000,
    team: 5000,
    pro: Infinity,
  };

  const limit = planLimits[subscription.plan];
  return subscription.token_usage + requiredTokens <= limit;
}

export async function consumeTokens(
  userId: string,
  tokens: number
): Promise<void> {
  const { data: subscription, error: fetchError } = await supabase
    .from('subscriptions')
    .select('token_usage')
    .eq('user_id', userId)
    .single();

  if (fetchError || !subscription) {
    throw new Error('Failed to fetch current token usage');
  }

  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({ token_usage: subscription.token_usage + tokens })
    .eq('user_id', userId);

  if (updateError) {
    throw new Error('Failed to update token usage');
  }
}

export async function logTokenUsage(
  userId: string,
  tokens: number,
  action: string
): Promise<void> {
  const { error } = await supabase.from('token_usage_logs').insert({
    user_id: userId,
    tokens,
    action,
    timestamp: new Date().toISOString(),
  });

  if (error) {
    console.error('Failed to log token usage:', error);
  }
}