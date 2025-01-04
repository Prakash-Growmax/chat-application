import { useNavigate } from "react-router-dom";
import PlanIcon from "../ui/plan-icon";
import ProfileIcon from "../ui/profile-icon";
import TeamsIcon from "../ui/teams";

export default function Resources() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col">
      <div
        className="flex items-center px-2 py-2 rounded-lg hover:bg-gray-200 cursor-pointer"
        onClick={() => {
          navigate("/plans");
        }}
      >
        <PlanIcon />
        <p className="ml-4 text-xs font-medium">Subscription</p>
      </div>
      <div
        className="flex items-center px-2 py-2 rounded-lg hover:bg-gray-200 cursor-pointer"
        onClick={() => {
          navigate("/teams");
        }}
      >
        <TeamsIcon />
        <p className="ml-4 text-xs font-medium">Teams</p>
      </div>
      <div
        className="flex items-center px-2 py-2 rounded-lg hover:bg-gray-200 cursor-pointer"
        onClick={() => {
          navigate("/settings");
        }}
      >
        <ProfileIcon />
        <p className="ml-4 text-xs font-medium">Profile</p>
      </div>
    </div>
  );
}
