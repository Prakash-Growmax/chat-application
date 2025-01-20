export interface ChatSession {
  id: string;
  // Add other session properties
}

export interface CreateSessionRequest {
  name: string;
  chat_metadata?: any;
}

export interface ChatHistory {
  data: {
    items: Array<any>;
  };
  // Add other session properties
}

export interface AnalyzeChatRequest {
  query: string;
  org_id: string;
  user_id: string;
  chat_id: string;
}
