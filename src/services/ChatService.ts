import { ApiResponse } from "@/types/api.types";
import {
  analyseDataset,
  AnalyzeChatRequest,
  AnalyzeChatResponse,
  ChatHistory,
  ChatSession,
  CreateChatResponse,
  CreateSessionRequest,
  RenameSession,
  renameSessionRequest,
  uploadDataSetRequest,
} from "@/types/Chat";
import { ApiClient, apiClient } from "./apiConfig";

class ChatService {
  constructor(private apiClient: ApiClient) {}

  async createSession(
    reqBody: CreateSessionRequest,
    options?: {
      headers: Record<string, string>;
    }
  ): Promise<ApiResponse<CreateChatResponse>> {
    return this.apiClient.post<CreateChatResponse>(
      "chat/sessions",
      reqBody,
      options
    );
  }
  async uploadDataset(
    reqBody: uploadDataSetRequest,
    chatId: string,
    options?: {
      headers: Record<string, string>;
    }
  ): Promise<ApiResponse<ChatSession>> {
    return this.apiClient.post<ChatSession>(
      `datasets/datasets?chat_id=${chatId}`,
      reqBody,
      options
    );
  }
  async analyzeDataset(
    reqBody: analyseDataset,
    chatId: string,
    options?: { headers: Record<string, string> }
  ): Promise<ApiResponse<ChatSession>> {
    return this.apiClient.post<ChatSession>(
      `analytics/analyze?chat_id=${chatId}`,
      reqBody,
      options
    );
  }
  async getSession(options?: {
    headers: Record<string, string>;
  }): Promise<ApiResponse<ChatSession>> {
    return this.apiClient.get<ChatSession>("chat/users/me/sessions", options);
  }

  async deleteSession(
    sessionId: string,
    options?: { headers: Record<string, string> }
  ): Promise<ApiResponse<ChatSession>> {
    // Pass headers explicitly into the third argument (if apiClient.post supports it)
    return this.apiClient.post<ChatSession>(
      `chat/sessions/${sessionId}/inactivate`,
      null, // No payload for the body
      options // Pass options containing headers as the config object
    );
  }
  async renameSession(
    chatId:string,
    reqBody:renameSessionRequest,
  
    options?: {
      headers: Record<string, string>;
    }
  ): Promise<ApiResponse<RenameSession>> {
    return this.apiClient.put<RenameSession>(
      `chat/sessions/${chatId}/name`,
      reqBody,
      options
    );
  }

  async getChatHistory(
    chatId: string,
    options?: {
      headers: Record<string, string>;
    }
  ): Promise<ApiResponse<ChatHistory>> {
    return this.apiClient.get<ChatHistory>(`queries/${chatId}`, options);
  }

  async analyzeQuery(
    chatId: string,
    reqBody: AnalyzeChatRequest,
    options?: {
      headers: Record<string, string>;
    }
  ): Promise<ApiResponse<AnalyzeChatResponse>> {
    return this.apiClient.post<AnalyzeChatResponse>(
      `analytics/analyze?chat_id=${chatId}`,
      reqBody,
      options
    );
  }
}

export const chatService = new ChatService(apiClient);
