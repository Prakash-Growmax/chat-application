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
}
export interface uploadDataSetRequest {
  s3_path: string;
  org_id: string;
  type: string;
}
export interface analyseDataset {
  query: string;
  user_id: string;
  org_id: string;
}

export interface AnalyzeChatRequest {
  query: string;
  org_id: string;
  user_id: string;
  chat_id: string;
}

//Api Response Types.....

export interface UploadDatasetResponse {
  error?: string;
  response?: string;
  id: string;
  status: string | "failed";
  token_usage: any;
}
export interface AnalyzeChatResponse {
  error?: string;
  response?: string;
  id: string;
  status: string | "failed";
  token_usage: any;
}
