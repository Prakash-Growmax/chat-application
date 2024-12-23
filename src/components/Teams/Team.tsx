import { useTeamMembers } from "@/hooks/teams/useTeamMembers";
import TeamTable from "./TeamTable";

const Team = () => {
  const { teamMembers, loading, refetch } = useTeamMembers();
  console.log("🚀 ~ Team ~ teamMembers:", teamMembers);

  return (
    <div className="p-6">
      <TeamTable
        teamMembers={teamMembers || []}
        loading={loading}
        refetch={refetch}
        hasTeamAccess
      />
    </div>
  );
};

export default Team;
