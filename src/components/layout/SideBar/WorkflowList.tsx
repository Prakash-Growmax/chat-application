import MyRecent from "@/components/ChatNew/MyRecent";
import MyFiles from "@/components/ui/my-file";
import List from "@mui/material/List";
import { useState } from "react";

function WorkflowList() {
  const [isDropdownOpen, setDropdownOpen] = useState(true);
  return (
    <List>
      <div className="flex flex-col">
        <div>
          <MyRecent
            isDropdownOpen={isDropdownOpen}
            setDropdownOpen={setDropdownOpen}
          />
        </div>
        <div
          className={`overflow-hidden transition-all duration-100 ease-in-out ${
            isDropdownOpen ? "mt-40" : ""
          }`}
        >
          <MyFiles />
        </div>
      </div>
    </List>
  );
}

export default WorkflowList;
