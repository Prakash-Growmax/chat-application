import { useNavigate } from "react-router-dom";

import { ListItemText } from "@/Theme/Typography";
import { SquareUser, Users, Wallet } from "lucide-react";

export default function Resources() {
  const navigate = useNavigate();

  const resources_items = [
    {
      path: "/plans",
      icon: <Wallet size={12} color="#64748B" />,
      name: "Subscription",
    },
    {
      path: "/teams",
      icon: <Users size={12} color="#64748B" />,
      name: "Teams",
    },
    {
      path: "/settings",
      icon: <SquareUser size={12} color="#64748B" />,
      name: "Profile",
    },
  ];
  return (
    <div className="flex flex-col w-full my-4">
      {resources_items.map((o) => (
        <div
          key={o.name}
          className="flex items-center rounded-lg hover:bg-gray-200 cursor-pointer gap-3 w-full px-2 py-1"
          onClick={() => navigate(o.path)}
        >
          {o.icon}
          <ListItemText> {o.name}</ListItemText>
        </div>
      ))}
    </div>
  );
}
