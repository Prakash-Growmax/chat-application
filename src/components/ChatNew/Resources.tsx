import { useNavigate } from "react-router-dom";
import PlanIcon from "../ui/plan-icon";
import ProfileIcon from "../ui/profile-icon";
import TeamsIcon from "../ui/teams";

export default function Resources() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col">
      <div
        className="flex items-center rounded-lg hover:bg-gray-200 cursor-pointer gap-3" style={{padding:"4.8px",marginTop:"4px"}}
        onClick={() => {
          navigate("/plans");
        }}
      >
        <PlanIcon />
        <p className="font-normal text-[11px] leading-[16px] text-[#64748b] font-inter">Subscription</p>
      </div>
      <div
        className="flex items-center rounded-lg hover:bg-gray-200 cursor-pointer gap-3"
        onClick={() => {
          navigate("/teams");
        }}
        style={{padding:"4.8px",marginTop:"4px"}}
      >
        <TeamsIcon />
        <p className="font-normal text-[11px] leading-[16px] text-[#64748b] font-inter">Teams</p>
      </div>
      <div
        className="flex items-center rounded-lg hover:bg-gray-200 cursor-pointer gap-3"
        onClick={() => {
          navigate("/settings");
        }}
        style={{padding:"4.8px",marginTop:"4px"}}
      >
        <ProfileIcon />
        <p className="font-normal text-[11px] leading-[16px] text-[#64748b] font-inter">Profile</p>
      </div>
    </div>
  );
}
