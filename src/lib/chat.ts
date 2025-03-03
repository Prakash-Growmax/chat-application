import { supabase } from './supabase';
import { ChatMessage, User } from '@/types';
import { calculateTokenCost, hasEnoughTokens } from './token-manager';


export async function saveChat(
  userId: string,
  csvFileId: string,
  message: ChatMessage
): Promise<void> {
  const { error } = await supabase.from('chats').insert({
    user_id: userId,
    csv_file_id: csvFileId,
    content: message.content,
    role: message.role,
    token_usage: message.tokenUsage,
    timestamp: message.timestamp.toISOString(),
  });

  if (error) {
    throw new Error('Failed to save chat message');
  }
}

export async function getChatHistory(
  userId: string,
  csvFileId: string
): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', userId)
    .eq('csv_file_id', csvFileId)
    .order('timestamp', { ascending: true });

  if (error) {
    throw new Error('Failed to fetch chat history');
  }

  return data.map((chat) => ({
    id: chat.id,
    content: chat.content,
    role: chat.role,
    tokenUsage: chat.token_usage,
    timestamp: new Date(chat.timestamp),
  }));
}

export async function updateUserTokenUsage(
  userId: string,
  tokenUsage: number
): Promise<void> {
  const { error } = await supabase
    .from('subscriptions')
    .update({ token_usage: tokenUsage })
    .eq('user_id', userId);

  if (error) {
    throw new Error('Failed to update token usage');
  }
}

export async function processMessage(
  user: User,
  message: string,
  csvFileId: string
): Promise<{ response: string; tokenUsage: number }> {
  // Calculate token cost for the request
  const tokenCost = calculateTokenCost(message);

  // Check if user has enough tokens
  if (!hasEnoughTokens(user, tokenCost)) {
    throw new Error('Insufficient tokens. Please upgrade your plan.');
  }

  try {
    // Save user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      tokenUsage: tokenCost,
      timestamp: new Date(),
    };
    await saveChat(user.id, csvFileId, userMessage);

    // Process message and generate response
    // This is where you'd integrate with your AI service
    const response = 'This is a simulated AI response based on your CSV data.';
    const responseTokenCost = calculateTokenCost(response);

    // Save AI response
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: response,
      role: 'assistant',
      tokenUsage: responseTokenCost,
      timestamp: new Date(),
    };
    await saveChat(user.id, csvFileId, aiMessage);

    // Update user's token usage
    const totalCost = tokenCost + responseTokenCost;
    await updateUserTokenUsage(user.id, user.tokenUsage + totalCost);

    return {
      response,
      tokenUsage: totalCost,
    };
  } catch (error) {
    console.error('Failed to process message:', error);
    throw error;
  }
}

export async function uploadCSV(
  file: File,
  userId: string
): Promise<{ fileId: string }> {
  const fileId = Date.now().toString();
  const filePath = `csv/${userId}/${fileId}.csv`;

  const { error: uploadError } = await supabase.storage
    .from('csv-files')
    .upload(filePath, file);

  if (uploadError) {
    throw new Error('Failed to upload CSV file');
  }

  const { error: dbError } = await supabase.from('files').insert({
    id: fileId,
    user_id: userId,
    name: file.name,
    size: file.size,
    path: filePath,
    uploaded_at: new Date().toISOString(),
  });

  if (dbError) {
    // Cleanup uploaded file if database insert fails
    await supabase.storage.from('csv-files').remove([filePath]);
    throw new Error('Failed to save file metadata');
  }

  return { fileId };
}

export async function deleteCSV(
  fileId: string,
  userId: string
): Promise<void> {
  const { data: file } = await supabase
    .from('files')
    .select('path')
    .eq('id', fileId)
    .eq('user_id', userId)
    .single();

  if (file) {
    await Promise.all([
      supabase.storage.from('csv-files').remove([file.path]),
      supabase.from('files').delete().eq('id', fileId),
      supabase.from('chats').delete().eq('csv_file_id', fileId),
    ]);
  }
}