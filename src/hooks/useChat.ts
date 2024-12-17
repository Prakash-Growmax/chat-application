import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { ChatMessage } from '@/types';
import { getChatHistory, processMessage } from '@/lib/chat/chat-service';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useChat(fileId: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChatHistory = useCallback(async () => {
    if (!user || !fileId) return;

    try {
      const history = await getChatHistory(user.id, fileId);
      setMessages(history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
      toast.error('Failed to load chat history');
    } finally {
      setLoading(false);
    }
  }, [user, fileId]);

  useEffect(() => {
    loadChatHistory();

    // Subscribe to real-time chat updates
    const chatChanges = supabase
      .channel('chat-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats',
          filter: `user_id=eq.${user?.id} AND csv_file_id=eq.${fileId}`
        },
        async () => {
          await loadChatHistory();
        }
      )
      .subscribe();

    return () => {
      chatChanges.unsubscribe();
    };
  }, [user, fileId, loadChatHistory]);

  const sendMessage = async (content: string): Promise<void> => {
    if (!user || !fileId) {
      toast.error('Not authenticated');
      return;
    }

    try {
      await processMessage(user, content, fileId);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to send message');
      }
      throw error;
    }
  };

  return {
    messages,
    loading,
    sendMessage
  };
}