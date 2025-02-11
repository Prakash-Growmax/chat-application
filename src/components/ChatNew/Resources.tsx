import { useNavigate } from "react-router-dom";

import { ListItemText } from "@/Theme/Typography";
import { useContext } from "react";
import AppContext from "../context/AppContext";
import LucideIcon from "../Custom-UI/LucideIcon";

export default function Resources({ isMobile, isTab }) {
  const navigate = useNavigate();
  const { setSideDrawerOpen } = useContext(AppContext);
  const resources_items = [
    {
      path: "/plans",
      icon: "Wallet",
      name: "Subscription",
    },
    {
      path: "/teams",
      icon: "Users",
      name: "Teams",
    },
    {
      path: "/settings",
      icon: "SquareUser",
      name: "Profile",
    },
  ];
  return (
    <div className="flex flex-col w-full my-4">
      {resources_items.map((o) => (
        <div
          key={o.name}
          className="flex items-center rounded-lg hover:bg-gray-200 cursor-pointer gap-3 w-full px-2 py-1"
          onClick={() => {
            navigate(o.path);
            if (isMobile || isTab) {
              setSideDrawerOpen(false);
            }
          }}
        >
          <LucideIcon name={o.icon} size={12} color="#64748B" />
          <ListItemText> {o.name}</ListItemText>
        </div>
      ))}
    </div>
  );
}
