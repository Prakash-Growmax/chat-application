import { useTeamMembers } from "@/hooks/teams/useTeamMembers";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { InviteMemberDialog } from "./InviteMemberDialog";
import { PendingInvites } from "./PendingInvites";
import TeamTable from "./TeamTable";

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
  console.log("🚀 ~ Team ~ teamMembers:", teamMembers);

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
      <TeamTable
        teamMembers={teamData?.members || []}
        loading={loading}
        refetch={refetch}
        hasTeamAccess
      />
      <div className="bg-white rounded-lg shadow mt-4">
        {teamData?.pendingInvites.length ? (
          <PendingInvites
            invites={teamData.pendingInvites}
            onCancel={cancelInvitationByEmail}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Team;
