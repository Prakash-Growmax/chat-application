import { supabase } from '../supabase';
import { ChatMessage, User } from '@/types';
import { deductTokens } from '../token/token-service';
import { toast } from 'sonner';

export async function saveChatMessage(
  userId: string,
  message: ChatMessage,
  fileId: string
): Promise<void> {
  try {
    const { error } = await supabase.from('chats').insert({
      user_id: userId,
      content: message.content,
      role: message.role,
      token_usage: message.tokenUsage,
      csv_file_id: fileId,
      timestamp: message.timestamp.toISOString()
    });

    if (error) throw error;
  } catch (error) {
    console.error('Failed to save chat message:', error);
    throw error;
  }
}

export async function getChatHistory(
  userId: string,
  fileId: string
): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .eq('csv_file_id', fileId)
      .order('timestamp', { ascending: true });

    if (error) throw error;

    return data.map(chat => ({
      id: chat.id,
      content: chat.content,
      role: chat.role,
      tokenUsage: chat.token_usage,
      timestamp: new Date(chat.timestamp)
    }));
  } catch (error) {
    console.error('Failed to fetch chat history:', error);
    throw error;
  }
}

export async function processMessage(
  user: User,
  content: string,
  fileId: string
): Promise<{ response: string; tokenUsage: number }> {
  try {
    const estimatedTokens = Math.ceil(content.length / 4); // Simple estimation
    
    // Deduct tokens before processing
    const tokenCost = await deductTokens(user.id, {
      actionType: 'chat_message',
      tokens: estimatedTokens
    });

    // Save user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      tokenUsage: tokenCost,
      timestamp: new Date()
    };
    await saveChatMessage(user.id, userMessage, fileId);

    // Simulate AI processing - Replace with actual AI processing
    const response = `This is a simulated response to: ${content}`;
    const responseTokens = Math.ceil(response.length / 4);

    // Deduct tokens for response
    const responseTokenCost = await deductTokens(user.id, {
      actionType: 'chat_response',
      tokens: responseTokens
    });

    // Save AI response
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: response,
      role: 'assistant',
      tokenUsage: responseTokenCost,
      timestamp: new Date()
    };
    await saveChatMessage(user.id, aiMessage, fileId);

    return {
      response,
      tokenUsage: tokenCost + responseTokenCost
    };
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('Failed to process message');
    }
    throw error;
  }
}