import { supabase } from './supabase';
import { User } from '@/types';

interface TokenCost {
  actionType: string;
  contentLength: number;
  contextData?: Record<string, any>;
}

export async function deductTokens(
  user: User,
  chatId: string,
  { actionType, contentLength, contextData }: TokenCost
): Promise<number> {
  const { data, error } = await supabase.rpc('deduct_tokens', {
    p_user_id: user.id,
    p_chat_id: chatId,
    p_action_type: actionType,
    p_content_length: contentLength,
    p_context_data: contextData || {},
  });

  if (error) {
    if (error.message.includes('Insufficient tokens')) {
      throw new Error('You have insufficient tokens. Please upgrade your plan to continue.');
    }
    throw new Error('Failed to process token deduction');
  }

  return data;
}

export async function getTokenUsageHistory(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<any[]> {
  let query = supabase
    .from('token_usage_details')
    .select(`
      id,
      action_type,
      tokens_used,
      context_data,
      created_at,
      chats (
        content
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (startDate) {
    query = query.gte('created_at', startDate.toISOString());
  }
  if (endDate) {
    query = query.lte('created_at', endDate.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    throw new Error('Failed to fetch token usage history');
  }

  return data;
}

export async function getTokenCosts(): Promise<Record<string, { base: number; multiplier: number }>> {
  const { data, error } = await supabase
    .from('token_costs')
    .select('action_type, base_cost, multiplier');

  if (error) {
    throw new Error('Failed to fetch token costs');
  }

  return data.reduce((acc, { action_type, base_cost, multiplier }) => ({
    ...acc,
    [action_type]: { base: base_cost, multiplier },
  }), {});
}

export async function estimateTokenCost(
  actionType: string,
  contentLength: number
): Promise<number> {
  const { data, error } = await supabase.rpc('calculate_token_cost', {
    p_action_type: actionType,
    p_content_length: contentLength,
  });

  if (error) {
    throw new Error('Failed to estimate token cost');
  }

  return data;
}