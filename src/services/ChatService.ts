import { ApiResponse } from "@/types/api.types";

import { analyseDataset, ChatSession, CreateSessionRequest,uploadDataSetRequest,ChatHistory } from "@/types/Chat";
import { ApiClient, apiClient } from "./apiConfig";

class ChatService {
  constructor(private apiClient: ApiClient) {}

  async createSession(
    reqBody: CreateSessionRequest,
    options?: {
      headers: Record<string, string>;
    }
  ): Promise<ApiResponse<ChatSession>> {
    return this.apiClient.post<ChatSession>("chat/sessions", reqBody, options);
  }
  async uploadDataset(reqBody:uploadDataSetRequest,options?:{headers:Record<string, string>;}):Promise<ApiResponse<ChatSession>>{
    return this.apiClient.post<ChatSession>("datasets/datasets",reqBody,options)
  }
 async analyzeDataset(reqBody:analyseDataset,options?:{headers:Record<string,string>;}):Promise<ApiResponse<ChatSession>>{
  return this.apiClient.post<ChatSession>("analytics/analyze",reqBody,options)
 }
  async getSession(sessionId: string): Promise<ApiResponse<ChatSession>> {
    return this.apiClient.get<ChatSession>(`/chat/sessions/${sessionId}`);
  }

  async deleteSession(sessionId: string): Promise<ApiResponse<void>> {
    return this.apiClient.delete<void>(`/chat/sessions/${sessionId}`);
  }

  async getChatHistory(
    chatId: string,
    options?: {
      headers: Record<string, string>;
    }
  ): Promise<ApiResponse<ChatHistory | undefined>> {
    return this.apiClient.get<ChatHistory>(`/queries/${chatId}`, options);
  }
}

export const chatService = new ChatService(apiClient);
