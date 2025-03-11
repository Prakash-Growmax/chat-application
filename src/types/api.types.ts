// types/api.types.ts
export interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
}

export interface AuthHeaders {
  Authorization?: string;
  'x-organization-id'?: string;
}
