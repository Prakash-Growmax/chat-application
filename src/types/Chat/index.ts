export interface ChatSession {
  id: string;
  // Add other session properties
}

export interface CreateSessionRequest {
  name: string;
  chat_metadata?: any;
}

export interface ChatHistory {
  details: string;
  // Add other session properties
}
