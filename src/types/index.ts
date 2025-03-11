export interface User {
  id: string;
  email: string;
  name: string;
  organizationId?: string;
  plan: 'single' | 'team' | 'pro';
  tokenUsage: number;
}
export interface MessageObject {
  content: {
    charts: {
      analysis: {
        key_insight: string;
        pandas_result: '';
        recommendation: string;
        trend: string;
      };
      chart_type?: string;
      data: {
        0: {
          type: string;
          x: string[];
          y: string[];
        };
      };
      layout: {
        colors: string[];
        title: string;
        xaxis: string;
        yaxis: string;
      };
      type: string;
      metadata: {
        data_type: string;
        timestamp: string;
        token_usage: {
          completion_tokens: number;
          prompt_tokens: number;
          total_tokens: number;
        };
      };
      id: string;
      isTyping: boolean;
      role: string;
      timestamp?: string | number;
    };
  };
}
export interface Message {
  id: string;
  content: string | object;
  role: 'user' | 'assistant';
  timestamp: Date;
  type: 'text' | 'chart' | 'table';
  messageObject?: MessageObject;
  data?: MessageObject;
  error?: boolean;
  isTyping?: boolean;
  file_path?: string;
  text?: string;
  suggested_questions?: string[];
}

export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  tokenUsage: number;
  plan: 'single' | 'team' | 'pro';
}
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  csvData: null;
  error: string | null;
  s3Key: string | null;
}
export interface Chat {
  id: string;
  organizationId: string;
  userId: string;
  messages: ChatMessage[];
  csvFile?: string;
  tokenUsage: number;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  tokenUsage: number;
  timestamp: Date;
}

export interface PlanDetails {
  name: 'single' | 'team' | 'pro';
  price: number;
  tokenLimit: number;
  features: string[];
  maxOrganizations: number;
  maxMembers: number;
}
