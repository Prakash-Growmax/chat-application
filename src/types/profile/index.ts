export interface Profile {
  id: string;
  email: string;
  organization_id: string;
  role: string;
  stripe_customer_id: string;
  current_token_usage: number;
  tokens_remaining: number;
  last_login: string;
  created_at: string;
  updated_at: string;
}
