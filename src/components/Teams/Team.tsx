import { useTeamMembers } from "@/hooks/teams/useTeamMembers";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { InviteMemberDialog } from "./InviteMemberDialog";
import EnhancedTeamTable from "./TeamTable";

const Team = () => {
  const {
    teamMembers,
    loading,
    refetch,
    error,
    teamData,
    inviteMemberByEmail,
    cancelInvitationByEmail,
  } = useTeamMembers();
  console.log("🚀 ~ Team ~ teamData:", teamData);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error?.message || ""}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <InviteMemberDialog onInvite={inviteMemberByEmail} />
      </div>
      <EnhancedTeamTable
        teamMembers={teamData?.members || []}
        pendingInvites={teamData?.pendingInvites || []}
        loading={loading}
        refetch={refetch}
        hasTeamAccess
        onCancelInvite={cancelInvitationByEmail}
      />
    </div>
  );
};

export default Team;
