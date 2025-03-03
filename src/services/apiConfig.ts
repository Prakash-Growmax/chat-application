import { ApiResponse, AuthHeaders, RequestOptions } from "@/types/api.types";

const baseURL = import.meta.env.VITE_ANALYSIS_URL;

export class ApiClient {
  private baseURL: string;
  private authToken?: string;
  private organizationId?: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async executeRequest<T>(
    endpoint: string,
    options: RequestOptions
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);

    // Add query parameters if they exist
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    try {
      const response = await fetch(url.toString(), {
        ...options,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          const errorData = await response.json();
          console.error(errorData)
        }
        throw new ApiError(response.status, response.statusText, data);
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error: string | number ) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Internal Error", error);
    }
  }

  // HTTP Method Handlers
  async get<T>(
    endpoint: string,
    options: Omit<RequestOptions, "method" | "body"> = {}
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options: Omit<RequestOptions, "method"> = {}
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: data,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options: Omit<RequestOptions, "method"> = {}
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data,
    });
  }

  async delete<T>(
    endpoint: string,
    options: Omit<RequestOptions, "method" | "body"> = {}
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(endpoint, { ...options, method: "DELETE" });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options: Omit<RequestOptions, "method"> = {}
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data,
    });
  }

  setAuthToken(tokenType: string, accessToken: string): void {
    this.authToken = `${tokenType} ${accessToken}`;
  }

  setOrganizationId(orgId: string): void {
    this.organizationId = orgId;
  }

  private getAuthHeaders(): AuthHeaders {
    const headers: AuthHeaders = {};
    if (this.authToken) {
      headers.Authorization = this.authToken;
    }
    if (this.organizationId) {
      headers["x-organization-id"] = this.organizationId;
    }
    return headers;
  }
}

export const apiClient = new ApiClient(baseURL);

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data: any
  ) {
    super(`${status}: ${statusText}`);
    this.name = "ApiError";
  }
}
