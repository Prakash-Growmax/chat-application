export interface TokenUsageData {
  email: string;
  current_token_usage: number;
  tokens_remaining: number;
  monthly_token_limit: number;
}

export interface TokenUsageState {
  data: TokenUsageData | null;
  loading: boolean;
  error: string | null;
}
