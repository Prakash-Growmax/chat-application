import MyRecent from "@/components/ChatNew/MyRecent";
import MyFiles from "@/components/ui/my-file";
import { List } from "lucide-react";

function SideBarListItems() {
  return (
    <div className="w-full">
      <List>
        <div className="flex flex-col">
          <div>
            <MyRecent />
          </div>

          <div
            className={`overflow-hidden transition-all duration-100 ease-in-out`}
          >
            <MyFiles />
          </div>
        </div>
      </List>
    </div>
  );
}

export default SideBarListItems;
