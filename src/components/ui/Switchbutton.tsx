import BarChartIcon from "@mui/icons-material/BarChart";
import { Tooltip } from "@mui/material";
import LucideIcon from "../Custom-UI/LucideIcon";
interface SwitchButtonPrps {
  isChecked: boolean;
  setIsChecked: (switc: boolean) => void;
}
const SwitchButton = ({ isChecked, setIsChecked }: SwitchButtonPrps) => {
  //   const [isChecked, setIsChecked] = useState(false);

  const toggleSwitch = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="inline-flex items-center p-2 bg-gray-100 rounded-full">
      <button
        role="switch"
        aria-checked={isChecked}
        onClick={toggleSwitch}
        className={`
          relative inline-flex items-center 
          h-[32px] rounded-full w-[66px]
          transition-colors duration-300 ease-in-out
          focus:outline-none focus:ring-1 focus:ring-offset-1 focus:none
          ${isChecked ? "bg-[#EAEDF2]" : "bg-[#EAEDF2]"}
        `}
      >
        <Tooltip title="View table">
          <span
            className={`
          absolute left-2 z-10 transition-opacity duration-300
         ${isChecked ? "opacity-40 " : "opacity-100 text-blue-500"}
        `}
          >
            <LucideIcon name={"Table"} size={20} />
          </span>
        </Tooltip>

        <Tooltip title="View chat">
          <span
            className={`
          absolute right-2 z-10 transition-opacity duration-300
          ${isChecked ? "opacity-100 text-blue-500" : "opacity-40"}
        `}
          >
            <BarChartIcon sx={{ width: "20px", height: "20px" }} />
          </span>
        </Tooltip>

        {/* Sliding background */}
        <span
          className={`
            absolute h-8 w-9
            transform rounded-full bg-white shadow-md
            transition-transform duration-300 ease-in-out
            ${isChecked ? "translate-x-7" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  );
};

export default SwitchButton;
