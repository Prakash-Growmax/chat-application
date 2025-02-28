import { useTeamMembers } from "@/hooks/teams/useTeamMembers";
import { useContext } from "react";
import AppContext from "../context/AppContext";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { InviteMemberDialog } from "./InviteMemberDialog";
import EnhancedTeamTable from "./TeamTable";
const Team = () => {
  const {
    loading,
    refetch,
    error,
    teamData,
    inviteMemberByEmail,
    cancelInvitationByEmail,
  } = useTeamMembers();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || ""}</AlertDescription>
      </Alert>
    );
  }
  const { sideDrawerOpen } = useContext(AppContext);
  
  return (
    <div
      className={`container mx-auto py-8 px-8 ${
        sideDrawerOpen
          ? "lg:max-w-screen-xl md:max-w-screen-md md:pl-36 lg:pl-14"
          : ""
      }`}
    >
      <div className="flex justify-between items-center mb-8 pt-16">
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
