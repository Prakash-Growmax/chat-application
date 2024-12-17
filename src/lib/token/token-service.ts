import { supabase } from '../supabase';
import { User } from '@/types';
import { toast } from 'sonner';

interface TokenDeduction {
  actionType: string;
  tokens: number;
  metadata?: Record<string, any>;
}

const PLAN_LIMITS = {
  single: 1000,
  team: 5000,
  pro: Infinity
};

export async function deductTokens(
  userId: string,
  { actionType, tokens, metadata = {} }: TokenDeduction
): Promise<number> {
  const { data: subscription, error: fetchError } = await supabase
    .from('subscriptions')
    .select('token_usage, plan')
    .eq('user_id', userId)
    .single();

  if (fetchError) throw new Error('Failed to fetch subscription');

  const planLimit = PLAN_LIMITS[subscription.plan as keyof typeof PLAN_LIMITS];
  
  if (subscription.token_usage + tokens > planLimit) {
    throw new Error('Token limit exceeded. Please upgrade your plan.');
  }

  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({ 
      token_usage: subscription.token_usage + tokens,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  if (updateError) throw new Error('Failed to update token usage');

  // Log token usage
  const { error: logError } = await supabase
    .from('token_usage_logs')
    .insert({
      user_id: userId,
      tokens_used: tokens,
      action_type: actionType,
      metadata,
      created_at: new Date().toISOString()
    });

  if (logError) {
    console.error('Failed to log token usage:', logError);
  }

  return tokens;
}

export async function getTokenUsage(userId: string): Promise<{
  used: number;
  limit: number;
  percentage: number;
}> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('token_usage, plan')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    const limit = PLAN_LIMITS[data.plan as keyof typeof PLAN_LIMITS];
    const percentage = (data.token_usage / limit) * 100;

    return {
      used: data.token_usage,
      limit,
      percentage: limit === Infinity ? 0 : percentage
    };
  } catch (error) {
    console.error('Failed to get token usage:', error);
    throw error;
  }
}

export async function getTokenUsageHistory(
  userId: string,
  limit: number = 10
): Promise<Array<{
  timestamp: Date;
  tokens: number;
  action: string;
}>> {
  try {
    const { data, error } = await supabase
      .from('token_usage_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data.map(log => ({
      timestamp: new Date(log.created_at),
      tokens: log.tokens_used,
      action: log.action_type
    }));
  } catch (error) {
    console.error('Failed to get token usage history:', error);
    throw error;
  }
}