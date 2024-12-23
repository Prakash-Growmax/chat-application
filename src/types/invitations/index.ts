export interface Invitation {
  id: string;
  organization_id: string;
  inviter_id: string;
  email: string;
  role: "admin" | "member";
  status: "pending" | "accepted" | "expired";
  expires_at: string;
  created_at: string;
  token: string;
}
