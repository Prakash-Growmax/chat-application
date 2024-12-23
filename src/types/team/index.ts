export interface Invitation {
  id: string;
  email: string;
  role: "admin" | "member";
  status: "pending" | "accepted" | "expired" | "cancelled";
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  role: "admin" | "member";
  organization_id: string;
}

export interface TeamMember {
  id: string;
  email: string;
  role: string;
  last_login: string;
  created_at: string;
  current_token_usage: number;
  tokens_remaining: number;
  organization_id: string;
}

export interface UseTeamMembersReturn {
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface TeamTableProps {
  teamMembers?: TeamMember[];
  loading?: boolean;
  refetch?: () => void;
  hasTeamAccess?: boolean;
}
