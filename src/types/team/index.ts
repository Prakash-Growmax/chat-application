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

export interface TeamData {
  members: TeamMember[];
  pendingInvites: Invitation[];
}

export interface UseTeamMembersReturn {
  teamData: TeamData | null;
  loading: boolean;
  error: string | null;
  inviteMemberByEmail: (
    email: string,
    role: "admin" | "member"
  ) => Promise<void>;
  removeMemberByEmail: (memberId: string) => Promise<void>;
  cancelInvitationByEmail: (invitationId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export interface TeamTableProps {
  teamMembers?: TeamMember[];
  loading?: boolean;
  refetch?: () => void;
  hasTeamAccess?: boolean;
}
