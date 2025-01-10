import { useNavigate } from "react-router-dom";
import PlanIcon from "../ui/plan-icon";
import ProfileIcon from "../ui/profile-icon";
import TeamsIcon from "../ui/teams";

export default function Resources() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-full" style={{marginTop:"8px",marginBottom:"8px"}}>
      <div
        className="flex items-center rounded-lg hover:bg-gray-200 cursor-pointer gap-3 w-full px-4 py-2"
        // style={{ padding: "4.8px", marginTop: "4px" }}
      
        onClick={() => {
          navigate("/plans");
        }}
      >
        <PlanIcon />
        <p className="font-inter text-slate-500  lg:text-[15px] md:text-[18px] text-[18px] leading-4">Subscription</p>
      </div>
      <div
        className="flex items-center rounded-lg hover:bg-gray-200 cursor-pointer gap-3 w-full px-4 py-2"
        style={{marginTop:"4px"}}
        // style={{ padding: "4.8px", marginTop: "4px" }}
        onClick={() => {
          navigate("/teams");
        }}
      >
        <TeamsIcon />
        <p className="font-inter text-slate-500  lg:text-[15px] md:text-[18px] text-[18px] leading-4">Teams</p>
      </div>
      <div
        className="flex items-center rounded-lg hover:bg-gray-200 cursor-pointer gap-3 w-full px-4 py-2"
        style={{marginTop:"4px"}}
        // style={{ padding: "4.8px", marginTop: "4px" }}
        onClick={() => {
          navigate("/settings");
        }}
      >
        <ProfileIcon />
        <p className="font-inter text-slate-500  lg:text-[15px] md:text-[18px] text-[18px] leading-4">Profile</p>
      </div>
    </div>
  );
}

