export interface AuthSession {
  access_token: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  user: {
    app_metadata: {
      provider: string;
      providers: string[];
    };
    aud: string;
    confirmation_sent_at: string;
    confirmed_at: string;
    email: string;
    email_confirmed_at: string;
    id: string;
    identities: string[];
    is_anonymous: false;
    last_sign_in_at: string;
    phone: string;
    recovery_sent_at: string;
    role: string;
    updated_at: string;
    user_metadata: {
      email_verified: false;
      phone_verified: false;
      sub: string;
    };
  };
}
