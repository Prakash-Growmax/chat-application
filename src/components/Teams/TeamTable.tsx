import { Button } from "@/components/ui/button";
import React from "react";
import LucideIcon from "../Custom-UI/LucideIcon";

interface TeamMember {
  id: string;
  email: string;
  role: string;
  last_login: string;
  tokens_remaining: number;
  current_token_usage: number;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

interface EnhancedTeamTableProps {
  teamMembers?: TeamMember[];
  pendingInvites?: Invitation[];
  loading?: boolean;
  refetch?: () => void;
  hasTeamAccess?: boolean;
  onCancelInvite: (inviteId: string) => void;
}

const EnhancedTeamTable: React.FC<EnhancedTeamTableProps> = ({
  teamMembers = [],
  pendingInvites = [],
  loading = false,
  refetch = () => {},
  hasTeamAccess = false,
  onCancelInvite,
}) => {
  if (!hasTeamAccess) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="mb-4 p-4 bg-gray-50 rounded-full">
            <LucideIcon name={"Lock"} className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Team Access Required
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm">
            Upgrade to a team plan to manage multiple team members and
            collaborate together.
          </p>
          <button
            onClick={() => (window.location.href = "/settings/billing")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Upgrade to Team Plan
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={5} className="px-6 py-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <LucideIcon
                name={"RotateCw"}
                className="h-8 w-8 animate-spin text-gray-400"
              />
              <p className="text-sm text-gray-500">Loading team data...</p>
            </div>
          </td>
        </tr>
      );
    }

    if (!teamMembers?.length && !pendingInvites?.length) {
      return (
        <tr>
          <td colSpan={5} className="px-6 py-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <LucideIcon name={"Users"} className="h-8 w-8 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  No team members yet
                </p>
                <p className="text-sm text-gray-500">
                  Start by inviting your team members
                </p>
              </div>
            </div>
          </td>
        </tr>
      );
    }

    const rows: JSX.Element[] = [];

    // Add active members
    teamMembers.forEach((member: TeamMember) => {
      rows.push(
        <tr key={member.id} className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">{member.email}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
              {member.role}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-500">
              {member.last_login
                ? new Date(member.last_login).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Never"}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-blue-500 rounded-full"
                  style={{
                    width: `${
                      member?.tokens_remaining
                        ? (member?.current_token_usage /
                            member?.tokens_remaining) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className="ml-2 text-sm text-gray-500">
                {member?.current_token_usage?.toLocaleString() || 0} /{" "}
                {member?.tokens_remaining?.toLocaleString()}
              </span>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              Active
            </span>
          </td>
        </tr>
      );
    });

    // Add pending invites
    pendingInvites.forEach((invite: Invitation) => {
      rows.push(
        <tr key={invite.id} className="hover:bg-gray-50 bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">{invite.email}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
              {invite.role}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-500">
              Invited on {new Date(invite.created_at).toLocaleDateString()}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-500">-</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center gap-2">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Pending
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancelInvite(invite.id)}
              >
                Cancel
              </Button>
            </div>
          </td>
        </tr>
      );
    });

    return rows;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 flex justify-between items-center border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
        <button
          onClick={refetch}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LucideIcon
            name={"RotateCw"}
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <LucideIcon name={"Mail"} className="h-4 w-4" />
                  Email
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <LucideIcon name={"UserCircle"} className="h-4 w-4" />
                  Role
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <LucideIcon name={"Clock"} className="h-4 w-4" />
                  Last Activity
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <LucideIcon name={"Coins"} className="h-4 w-4" />
                  Token Usage
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {renderContent()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnhancedTeamTable;
