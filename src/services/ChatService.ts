import { ApiResponse } from "@/types/api.types";
import { ChatSession, CreateSessionRequest } from "@/types/Chat";
import { ApiClient, apiClient } from "./apiConfig";

class ChatService {
  constructor(private apiClient: ApiClient) {}

  async createSession(
    reqBody: CreateSessionRequest,
    options?: {
      headers: Record<string, string>;
    }
  ): Promise<ApiResponse<ChatSession>> {
    return this.apiClient.post<ChatSession>("/chat/sessions", reqBody, options);
  }

  async getSession(sessionId: string): Promise<ApiResponse<ChatSession>> {
    return this.apiClient.get<ChatSession>(`/chat/sessions/${sessionId}`);
  }

  async deleteSession(sessionId: string): Promise<ApiResponse<void>> {
    return this.apiClient.delete<void>(`/chat/sessions/${sessionId}`);
  }
}

export const chatService = new ChatService(apiClient);
